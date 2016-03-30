/**
 * Created by ds on 10/02/16.
 */

// if you don't specify a html file, the sniper will generate a div with id "rootDiv"

var container = document.getElementById('rootDiv');
container.style.height = "100%";
container.classList.add("row");

var instances = {};
console.log(container);

//var modal = document.createElement("div");
//modal.id = 'loadingAnimation';
//modal.classList.add("modal");
//modal.innerHTML += "<h1>Loading...</h1>";
//var body  = document.getElementsByTagName("body");
//container.appendChild(modal);

//httpGetAsync('http://localhost:8080', function (res) {
//    console.log("SUCCESS: Received data!");
//    init( JSON.parse(res) );
//});

var testData = [
    {
        type: "url",
        url: "Drosophila-Notch-TGF-WNT-No-TF.csv"
    }
    ,{
        type: "url",
        url: "Core-Human-Notch-TGF-WNT-No-TF.csv"

    }
    //,{
    //    type: "url",
    //    url: "Elegans-Notch-TGF-WNT-No-TF.csv"
    //}
];

for (var i = 0; i < testData.length; i++) {
    httpPostAsync('http://localhost:8080/', testData[i], function (res) {
        console.log("SUCCESS: Received data!");
        var container = document.getElementById('rootDiv');
        var grpCont = document.getElementById("grp");
        if (!grpCont) {
            grpCont = document.createElement("div");
            grpCont.classList.add("row");
            grpCont.id = "grp";
            container.appendChild(grpCont);
        }
        var visCont = document.createElement("div");
        var id = makeid();
        visCont.id = "div" + id;
        visCont.style.height = "50%";
        visCont.classList.add("col-2");
        visCont.classList.add("panel");
        grpCont.appendChild(visCont);
        var data = JSON.parse(res);
        data.container = visCont;
        console.log('DATA:');
        console.log(data);

        // Initialize network and create aggregate when ready
        init( data, id , function (network) {
            var packedNetwork = { network: JSON.stringify(network) };
            httpPostAsync('http://localhost:8080/aggregate', packedNetwork, function (res, err) {
                var container = document.getElementById('rootDiv');
                var grpCont = document.getElementById("grp");
                var rowCont = document.getElementById("row2");
                if (!rowCont) {
                    rowCont = document.createElement("div");
                    rowCont.classList.add("row");
                    rowCont.id = "row2";
                    grpCont.appendChild(rowCont);
                }
                var visCont = document.createElement("div");
                var id = makeid();
                visCont.id = "div" + id;
                visCont.style.height = "50%";
                visCont.classList.add("col-2");
                visCont.classList.add("panel");
                rowCont.appendChild(visCont);
                var data = JSON.parse(res);
                data.container = visCont;
                var app = require('biojs-vis-munavi');
                var state =  {
                    container: data.container || '',
                    id: "div" + id,
                    elements: data,
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
                        labelColor: "#ffffff",
                        colorKey: false
                    },
                    ready: function (evt) { /* ... */
                    },

                    zoom: 1,
                    pan: {x: 0, y: 0},

                    // Dennis
                    directed: true,
                    menuEnabled: true,
                    cameraType: '',//'orthographic',
                    cameraPosition: {
                        x: 0,
                        y: 0,
                        z: 5000
                    },
                    layout: {
                        name: 'Circle'
                    },
                    interLayerDistance: 80,
                    nodesize: 100,
                    normalisation: 'log',
                    //layerOrder: [
                    //    'lAggregate'
                    //],


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
                    zoomingEnabled: false,
                    userZoomingEnabled: false,
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
                var aggVis = new app(container, state);
                aggVis.init();
                //init(data, id, function() {});
            })
        });
    })
}

//var container = document.getElementById('rootDiv');
//var panel1 = document.createElement("div");
//var header1 = document.createElement("div");
//var vis1 = document.createElement("div");


function init( data, id, callback ) {
// state is the object that describes the whole view
//    var modal = document.getElementById("loadingAnimation");
//    container.removeChild(modal);
    console.log("HERE COMES THE DATA!!:");
    console.log(data);

    var app = require("biojs-vis-munavi");
    //var instance = app.init({el: state.container, state: state});

    var state =  {
        container: data.container || '',
        id: "div" + id,
        elements: data,
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
            labelColor: "#ffffff",
            colorKey: true
        },
        ready: function (evt) { /* ... */
        },

        zoom: 1,
        pan: {x: 0, y: 0},

        // Dennis
        directed: true,
        menuEnabled: true,
        cameraType: '',//'orthographic',
        cameraPosition: {
            x: 0,
            y: 0,
            z: 5000
        },
        layout: {
            name: 'Manual'
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

    instances[id] = new app(data.container, state);

    instances[id].init();

    var temp = instances[id].state.elements;
    var returnElements = {};

    returnElements.nodes = temp.nodes;
    returnElements.layers = temp.layers;
    returnElements.nodelayers = temp.nodelayers;
    returnElements.edges = temp.edges;
    returnElements.elements = {};
    for (var el in temp.elements) {
        if (temp.elements.hasOwnProperty(el)) {
            var newEl = {};
            var x = temp.elements[el];
            for (var att in x) {
                if (x.hasOwnProperty(att) && att !== 'ui') {
                    newEl[att] = x[att];
                }
            }
            returnElements.elements[el] = newEl;
        }
    }
    callback(returnElements);
    // Get first instance camera
    //for (var prop in instances) {
    //    if (instances.hasOwnProperty(prop)) {
    //        var testCam = instances[prop].state.camera;
    //    }
    //    break;
    //}
    //instances[id].state.camera.position = testCam.position;
    //console.log(instances[id].state.camera);
    //console.log(instances[id].state.elements);
    //var returnElements = Object.assign({}, instances[id].state.elements); // Clone network
    //for (var e in returnElements.elements) {
    //    console.log(e);
    //    if (returnElements.elements.hasOwnProperty(e)) {
    //        if (returnElements.elements[e].hasOwnProperty('ui')) {
    //            returnElements.elements[e].ui = {};
    //        }
    //    }
    //}
    //console.log(returnElements);
    //console.log(instances[id].state.elements);
//    callback(instances[id].state.elements);

// Create vis for aggregate network.


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
    xhttp.send(JSON.stringify(data));

}

// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
