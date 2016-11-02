var createChartRenderer = require("phantom-chartjs").createChartRenderer;
var fs = require("fs");
var path = require("path");
var mkdir = require("mkdir-p");

var outputDir = path.join(__dirname, "output");
mkdir.sync(outputDir);

createChartRenderer({ logger: console }, function(err, renderer) {
    if (err) throw err;

    process.on("exit", function() {
        renderer.close();
    });

    var config = {
        width: 620,
        scale: 2,
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

    renderer.renderBuffer(config, function (err, buffer) {
        if (err) throw err;

        var outFile = path.join(outputDir, "output.png");

        fs.writeFile(outFile, buffer, function (err) {
            if (err) throw err;

            console.log("Created " + outFile);
            process.exit(0);
        });
    });
});
