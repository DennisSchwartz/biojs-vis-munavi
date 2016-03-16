/**
 * Created by ds on 10/02/16.
 */

// if you don't specify a html file, the sniper will generate a div with id "rootDiv"

var container = document.getElementById('rootDiv');
container.style.height = "100%";

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
    //{
    //    type: "url",
    //    url: "Human-Notch-TGF-WNT-No-TF.csv"
    //
    //}
];

for (var i = 0; i < testData.length; i++) {
    httpPostAsync('http://localhost:8080/', testData[i], function (res) {
        console.log("SUCCESS: Received data!");
        var container = document.getElementById('rootDiv');
        var visCont = document.createElement("div");
        var id = makeid();
        visCont.id = "div" + id;
        visCont.style.height = "300px";
        container.appendChild(visCont);
        var data = JSON.parse(res);
        data.container = visCont;
        console.log(data);
        init( data, id );
    })
}

function init( data, id ) {
// state is the object that describes the whole view
//    var modal = document.getElementById("loadingAnimation");
//    container.removeChild(modal);
    console.log("HERE COMES THE DATA!!:");
    console.log(data);

    var app = require("biojs-vis-munavi");
    //var instance = app.init({el: state.container, state: state});

    instances[id] = new app();

    instances[id].init({el: data.container, state: {
        container: data.container || '',
        elements: data,
        //style: [ {
        //    selector: 'node',
        //    style: {
        //        'content': 'data(id)'
        //    }
        //}],
        style: {
            colorByLayer: true,
            layerLabels: true
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
    }});
    console.log(app);
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