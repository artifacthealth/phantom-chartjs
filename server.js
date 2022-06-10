var path = require("path");
var childProcess = require("child_process");
var phantomjs = require("phantomjs-prebuilt");

var scriptPath = path.join(__dirname, "script.js"),
    chartJsPath = path.resolve(path.dirname(require.resolve("chart.js")), "../dist/Chart.bundle.min.js"),
    binPath = phantomjs.path,
    port = process.env.PORT || "8080",
    args = [scriptPath, port, chartJsPath];

console.log(`Spawning PhantomJS server using command: ${binPath} ${args.join(" ")}`);

childProcess.spawnSync(
    binPath,
    args,
    {
        stdio: "inherit",
    }
);

process.exit();