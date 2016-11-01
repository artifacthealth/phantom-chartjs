/**
 * Script executed by PhantomJS to generate a chart as an image.
 */
var system = require("system");
var webpage = require("webpage");
var server = require('webserver').create();
var fs = require("fs");

phantom.onError = function (msg, trace) {

    console.error("Unhandled error: " + createErrorMessage(msg, trace));
    phantom.exit(1);
};

if (system.args.length !== 3) {
    console.log("Usage: script.js <portnumber> <path-to-chartjs>");
    phantom.exit(1);
}

var port = system.args[1],
    chartJsPath = system.args[2];

if (!fs.exists(chartJsPath)) {
    console.log("PhantomJS server could not find Chart.js at path '" + chartJsPath + "'.");
    phantom.exit(1);
}

var listening = server.listen(port, handleRequest);
if (!listening) {
    console.log("PhantomJS server unable to listen on port " + port + ". Exiting.");
    phantom.exit(1);
}
else {
    console.log("PhantomJS server listening on port " + port);
}

function handleRequest(request, response) {

    if (request.method != "POST") {

        sendError(response, "Bad Request. Expected POST.", 400);
        return;
    }

    if (request.headers["content-type"] != "application/json") {

        sendError(response, "Bad Request. Expected content type of 'application/json'.", 400);
        return;
    }

    render(request.post, function (err, result) {

        if (err) {
            sendError(response, err);
            return;
        }

        send(response, result);
    });
}

function sendError(response, message, statusCode) {

    send(response, message, statusCode || 500);
}

function send(response, data, statusCode) {

    response.statusCode = statusCode || 200;
    response.headers = {
        "Cache": "no-cache",
        "Content-Type": "text/plain"
    };
    response.write(data);
    response.closeGracefully();
}

function render(configText, callback) {

    var page = webpage.create(),
        called = false;

    page.onError = function (msg, trace) {

        if (!called) {
            called = true;
            callback(createErrorMessage(msg, trace));
        }
    };

    // Chart.js must be installed as a peer dependency.
    page.injectJs(chartJsPath);

    var data = page.evaluate(renderPage, configText);
    page.close();

    if (!called) {
        called = true;

        if (data) {
            //splitDataUrl(data, callback);
            callback(null, data);
        }
        else {
            callback("Unable to parse chart configuration.");
        }
    }
}

function renderPage(configText) {

    // parse json
    try {
        var config = JSON.parse(configText);
    }
    catch (e) {
        return null;
    }

    // make sure we have a chart object.
    if (!config.chart) {
        return null;
    }

    // make sure we have an options object.
    if (!config.chart.options) {
        config.chart.options = {};
    }

    // turn off interactive features of chart.js
    config.chart.options.responsive = false;
    config.chart.options.animation = false;

    // get the width if specified. if not specified, default to 720.
    var width = config.width || 720;

    // get the height if specified. if height is not specified, calculate using aspect ratio.
    var height = config.height || (width / (config.chart.options.aspectRatio || 2));

    // create the canvas
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    document.body.appendChild(canvas);

    var chart = new Chart(canvas, config.chart);
    var data = canvas.toDataURL(config.type || "png", config.quality);
    chart.destroy();

    return data;
}

function createErrorMessage(msg, trace) {

    var stack = [msg];

    if (trace && trace.length) {
        trace.forEach(function (t) {
            stack.push("    " + t.file + ": " + t.line + (t.function ? " (in function '" + t.function + "')" : ""));
        });
    }

    return stack.join("\n");
}
