var createChartRenderer = require("./index").createChartRenderer;
var assert = require('chai').assert;
var sizeOf = require('image-size');

var defaultChartConfig = {
    chart: {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    }
};

var defaultOptions = {
    chartJsPath: "./node_modules/chart.js/dist/Chart.min.js",
    logger: console
};

describe("createChartRenderer", function() {
    this.timeout(5000);

    it("should return an error if Chart.js cannot be found", function(done) {

        createChartRenderer({ chartJsPath: "foo" }, function(err) {

            assert.ok(err);
            assert.include(err.message, "Could not find Chart.js at path 'foo'");
            done();
        });
    });

    it("should return an error if the port is not available", function(done) {

        createChartRenderer(defaultOptions, function(err, renderer) {
            if (err) return done(err);

            createChartRenderer(defaultOptions, function(err) {

                assert.ok(err);
                assert.include(err.message, "Unable to start PhantomJS server on port");

                renderer.close(done);
            });
        });
    });
});

describe("ChartRenderer", function() {
    this.timeout(5000);

    var renderer;

    before(function(done) {

        createChartRenderer(defaultOptions, function(err, result) {
            if (err) return done(err);

            renderer = result;
            done();
        });
    });

    after(function(done) {

        if (renderer) {
            renderer.close(done);
        }
        else {
            done();
        }
    });

    describe("#renderDataUrl", function() {

        it("should return a data url for the specified chart", function(done) {

            renderer.renderDataUrl(defaultChartConfig, function (err, result) {
                if (err) return done(err);

                assert.include(result, "base64");
                done();
            });
        });
    });

    describe("#renderBuffer", function() {

        it("should return a Buffer for the specified chart", function(done) {

            renderer.renderBuffer(defaultChartConfig, function (err, result) {
                if (err) return done(err);

                assert.instanceOf(result, Buffer);
                done();
            });
        });

        it("should return an image of dimensions 720x360 if not otherwise specified", function(done) {

            assertDimensions(defaultChartConfig, 720, 360, done);
        });

        it("should return an image of dimensions specified width and default aspect ratio", function(done) {

            var config = cloneDefaultConfig();
            config.width = 200;
            assertDimensions(config, 200, 100, done);
        });

        it("should return an image of dimensions specified width and height", function(done) {

            var config = cloneDefaultConfig();
            config.width = 200;
            config.height = 300;
            assertDimensions(config, 200, 300, done);
        });

        it("should return an image of dimensions specified width and aspect ratio", function(done) {

            var config = cloneDefaultConfig();
            config.width = 200;
            config.chart.options.aspectRatio = 1;
            assertDimensions(config, 200, 200, done);
        });

        it("should return a jpeg if specified", function(done) {

            var config = cloneDefaultConfig();
            config.type = "image/jpeg";

            renderer.renderBuffer(config, function (err, result) {
                if (err) return done(err);

                var dimensions = sizeOf(result);
                assert.equal(dimensions.type, "jpg");
                done();
            });
        });

        function assertDimensions(config, width, height, done) {

            renderer.renderBuffer(config, function (err, result) {
                if (err) return done(err);

                var dimensions = sizeOf(result);
                assert.equal(dimensions.type, "png");
                assert.equal(dimensions.width, width);
                assert.equal(dimensions.height, height);
                done();
            });
        }
    });
});

function cloneDefaultConfig() {

    return {
        chart: defaultChartConfig.chart
    }
}
