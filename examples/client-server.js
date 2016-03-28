/**
 * Created by ds on 28/03/2016.
 */




var data = { type: "url", url: "Core-Human-Notch-TGF-WNT-No-TF.csv" };

httpPostAsync('http://localhost:8080/create', JSON.stringify(data), function (res) {
    var app = require('biojs-vis-munavi');
    var container = document.getElementById("rootDiv2");
    var data = JSON.parse(res);
    var state =  {
        container: container || '',
        elements: data,
        id: 'rootDiv2',
        //style: [ {
        //    selector: 'node',
        //    style: {
        //        'content': 'data(id)'
        //    }
        //}],
        style: {
            colorByLayer: true,
            layerLabels: true,
            edgeColor: "#ffffff",
            backgroundColor: "#000000",
            labelColor: "#ffffff"
        },
        ready: function (evt) { /* ... */
        },

        zoom: 1,
        pan: {x: 0, y: 0},

        // Dennis
        directed: true,
        menuEnabled: true,
        cameraType: 'orthographic',
        layout: {
            name: 'Circle'
        },
        interLayerDistance: 800,
        nodesize: 100,
        normalisation: 'log',
        layerOrder: [
            'Transcriptionalregulation',
            'Post-transcriptionalregulation',
            'Post-translationalmodification',
            'Directedprotein-proteininteraction',
            'Pathwayregulation',
            'Interactionbetweenpathwaymembers',
            'interactionfromexternaldatabases'
        ],


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
    var instance = new app(container, state);
    instance.init();
});


function httpPostAsync(url, data, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
            console.log("Success!");
            callback(xhttp.responseText);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);//JSON.stringify(data));

}