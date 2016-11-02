[![Build Status](https://travis-ci.org/artifacthealth/phantom-chartjs.svg?branch=master)](https://travis-ci.org/artifacthealth/phantom-chartjs)

# phantom-chartjs

phantom-chartjs is a CommonJS module for rendering [Chart.js](http://http://www.chartjs.org/) charts to images on the server. Rendering is accomplished using PhantomJS. In order 
to keep response times low, PhantomJS is spanwed as a server process.

## Installation

Install using [npm](https://www.npmjs.com/):

```
$ npm install phantom-chartjs --save
```

## TypeScript

TypeScript definitions are included in the package, so typings are automatically provided to TypeScript without any additional work.

## Usage

#### Create a renderer

In your server, create a renderer. This starts a PhantomJS server on the default port of 8083. If a different port is desired, pass it as on option to `createChartRenderer`.
*The renderer should be created once and used throughout your server.*

```javascript
import {createChartRenderer} from "phantom-chartjs";

createChartRenderer({ port: 8080 }, (err, renderer) => {
    if (err) throw err;
    
    ...
});
```

#### Define your chart configuration

See the [Chart.js documentation](http://www.chartjs.org/docs/#chart-configuration) for more information.  

```javascript
var config = {
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
```

#### Render to a Buffer

In order to render a chart to an image Buffer, call `renderBuffer`. By default the PNG format is used.

```javascript
renderer.renderBuffer(config, function (err, buffer) {
    if (err) throw err;

    // the `buffer` now contains a Buffer with the rendered PNG
    ...
});
```

#### Render to Base 64

You can also render to base 64 encoding using `renderBase64`.

```javascript
renderer.renderBase64(config, function (err, data) {
    if (err) throw err;

    // the `data` now contains a base 64 encoding string with the rendered PNG
    ...
});
```

#### Close the renderer

Make sure to close the renderer when your server exits; otherwise, the PhantomJS server process may not exit.

```javascript
process.on("exit", () => {

    renderer.close();
});
```