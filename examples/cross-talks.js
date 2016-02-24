/**
 * Created by ds on 10/02/16.
 */

// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-munavi");

var container = document.getElementById('rootDiv');

httpGetAsync('http://localhost:8080', function (res) {
    console.log("SUCCESS: Received data!");
    init( JSON.parse(res) );
});

function init( data ) {
// state is the object that describes the whole view
    console.log(data);
    var state = {
        container: container,
        elements: data,
        //style: [ {
        //    selector: 'node',
        //    style: {
        //        'content': 'data(id)'
        //    }
        //}],
        style: {
            colorByLayer: true
        },
        ready: function (evt) { /* ... */
        },

        zoom: 1,
        pan: {x: 0, y: 0},

        // Dennis
        directed: true,
        menuEnabled: true,
        cameraType: '',//'orthographic',
        layout: {
            name: 'Manual'
        },
        interLayerDistance: 800,
        nodesize: 100,
        normalisation: 'log',


        physicsSettings: {
            /**
             * Ideal length for links (springs in physical model).
             */
            springLength: 1500,

            /**
             * Hook's law coefficient. 1 - solid spring.
             */
            springCoeff: 0.00008,

            /**
             * Coulomb's law coefficient. It's used to repel nodes thus should be negative
             * if you make it positive nodes start attract each other :).
             */
            gravity: -2.0,

            /**
             * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
             * The closer it's to 1 the more nodes algorithm will have to go through.
             * Setting it to one makes Barnes Hut simulation no different from
             * brute-force forces calculation (each node is considered).
             */
            theta: 0.8,

            /**
             * Drag force coefficient. Used to slow down system, thus should be less than 1.
             * The closer it is to 0 the less tight system will be.
             */
            dragCoeff: 0.02,

            /**
             * Default time step (dt) for forces integration
             */
            timeStep : 10,

            /**
             * Maximum movement of the system which can be considered as stabilized
             */
            stableThreshold: 0.009
        },

        minZoom: 1e-50,
        maxZoom: 1e50,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        panningEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        selectionType: 'single',
        touchTapThreshold: 8,
        desktopTapThreshold: 4,
        autolock: false,
        autoungrabify: false,
        autounselectify: false,

        headless: false,
        styleEnabled: true,
        hideEdgesOnViewport: false,
        hideLabelsOnViewport: false,
        textureOnViewport: false,
        motionBlur: false,
        motionBlurOpacity: 0.2,
        wheelSensitivity: 1,
        pixelRatio: 1,
        initrender: function (evt) { /* ... */
        },
        renderer: {/* ... */}
    };

    var instance = app.init({el: rootDiv, state: state});
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
