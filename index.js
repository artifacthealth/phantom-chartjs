var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var path = require("path");
var childProcess = require("child_process");
var phantomjs = require("phantomjs-prebuilt");
var restify = require("restify-clients");
var fs = require("fs");

var scriptPath = path.join(__dirname, "script.js"),
    binPath = phantomjs.path;

function ChartRenderer(options) {
    EventEmitter.call(this);

    if (!options) {
        options = {};
    }

    this.logger = options.logger;
    this.port = options.port || 8083;
    this.chartJsPath = options.chartJsPath || path.resolve(__dirname, "../node_modules/chart.js/dist/Chart.min.js");
}

inherits(ChartRenderer, EventEmitter);

ChartRenderer.prototype.renderDataUrl = function (chart, callback) {

    if (this._closing || this._closed) {
        return callback(new Error("Renderer is closed."));
    }

    this._request.post("/", safeStringify(chart), function (err, req, res) {
        if (err) return callback(err);

        callback(null, res.body);
    });
};

ChartRenderer.prototype.renderBuffer = function (chart, callback) {

    this.renderDataUrl(chart, function (err, data) {
        if (err) return callback(err);

        if (typeof data !== "string") {
            callback("Bad data url. Expected string.");
            return;
        }

        var index = data.indexOf("base64,");
        if (index == -1) {
            callback("Bad data url. Unable to find base64 data separator.");
            return;
        }

        callback(null, new Buffer(data.substring(index + 7), "base64"));
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

    var self = this;

    // check to make sure user has installed the peer dependency for Chart.js
    fs.exists(this.chartJsPath, function (exists) {

        if (!exists) {
            callback(new Error("Could not find Chart.js at path '" + self.chartJsPath + "'. Install the peer dependency in your project " +
                                "using `npm install chart.js --save`."));
            return;
        }

        // create a HTTP client to connect to the server
        self._request = restify.createStringClient({
            url: "http://localhost:" + self.port,
            contentType: "application/json"
        });

        // start up the PhantomJS server
        self._startPhantom(callback);
    });
};

ChartRenderer.prototype._startPhantom = function (callback) {

    var child = childProcess.spawn(binPath, [scriptPath, this.port, this.chartJsPath]),
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
