var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var path = require("path");
var childProcess = require("child_process");
var phantomjs = require("phantomjs-prebuilt");
var restify = require("restify-clients");
var fs = require("fs");
var async = require("async");

var scriptPath = path.join(__dirname, "script.js"),
    chartJsPath = path.resolve(path.dirname(require.resolve("chart.js")), "../dist/Chart.bundle.min.js");
    binPath = phantomjs.path;

function ChartRenderer(options) {
    EventEmitter.call(this);

    if (!options) {
        options = {};
    }

    this.logger = options.logger;
    this.port = options.port || 8083;

    // the PhantomJS server is single threaded and rendering (in our case) seems to happening synchronously. so let's queue up requests
    // here instead of on the server. the server seems to perform better this way and let's us keep track of any outstanding requests.
    var self = this;
    this._queue = async.queue(function(request, done) { self._request.post("/", request, done) }, 1);
}

inherits(ChartRenderer, EventEmitter);

ChartRenderer.prototype.renderBase64 = function (config, callback) {

    if (config == null) {
        throw new Error("Missing required argument 'config'.");
    }

    if (callback == null) {
        throw new Error("Missing required argument 'callback'.");
    }

    if (this._closing || this._closed) {
        return callback(new Error("Renderer is closed."));
    }

    if (config.chart == null) {
        return callback(new Error("Missing chart configuration."));
    }

    if (config.type && (config.type != "PNG" && config.type != "JPEG" && config.type != "GIF")) {
        return callback(new Error("Unsupported image type '" + config.type + "'. Supported types are PNG, GIF, and JPEG."));
    }

    this._queue.push(safeStringify(config), function(err, req, res) {
        if (err) return callback(err);

        callback(null, res.body);
    });
};

ChartRenderer.prototype.renderBuffer = function (config, callback) {

    this.renderBase64(config, function (err, data) {
        if (err) return callback(err);

        callback(null, new Buffer(data, "base64"));
    });
};

ChartRenderer.prototype.close = function (callback) {

    if(callback) {
        if(this._closed) {
            callback();
            return;
        }

        this.on("closed", callback);
    }

    if (this._closing) return;
    this._closing = true;

    this.emit("closing");

    if (!this._process) {

        this._closed = true;
        this.emit("closed");
        return;
    }

    var self = this;
    this._process.on("exit", function () {

        self._closed = true;
        self.emit("closed");
    });

    this._process.kill("SIGTERM");
};

ChartRenderer.prototype.open = function (callback) {

    if (this._opening || this._open) {
        return callback(new Error("Renderer is already open."));
    }

    this._opening = true;

    // create a HTTP client to connect to the server
    this._request = restify.createStringClient({
        url: "http://localhost:" + this.port,
        contentType: "application/json"
    });

    // start up the PhantomJS server
    this._startPhantom(callback);
};

ChartRenderer.prototype._startPhantom = function (callback) {

    var child = childProcess.spawn(binPath, [scriptPath, this.port, chartJsPath]),
        self = this;

    var stdout = "";

    child.stdout.on('data', function (data) {

        if (data) {
            var text = data.toString();

            // while we are opening, track stdout and watch for text indicating the server started ok
            if (self._opening) {
                stdout += text;

                if (stdout.indexOf("listening") != -1) {
                    self._opening = false;
                    callback(null, self);
                }
                else if (stdout.indexOf("unable to listen") != -1) {
                    self._opening = false;
                    callback(new Error("Unable to start PhantomJS server on port " + self.port));
                }
            }

            // send output to bunyan logger if we have one
            if (self.logger) {
                self.logger.trace(text);
            }
        }
    });

    child.on("exit", function () {

        // if we are not in the process of closing then this is an error
        if (!self._closing) {

            // flag process as closed even if we did not initiate it
            self._closed = true;

            self.emit("error", new Error("PhantomJS server exited unexpectedly."));
        }
    });

    this._process = child;
};

function createChartRenderer (options, callback) {

    var renderer = new ChartRenderer(options);
    renderer.open(callback);
}

function safeStringify(value) {

    if (value == null) return null;

    try {
        return JSON.stringify(value);
    }
    catch (e) {
        return null;
    }
}

exports.createChartRenderer = createChartRenderer;
