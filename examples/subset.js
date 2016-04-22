/**
 * Created by ds on 14/04/2016.
 */


var data = {
    pathways: ['Hedgehog', 'WNT/Wingless'],
    layers: ['Transcriptionalregulation', 'Post-transcriptionalregulation'],//, 'Interactionbetweenpathwaymembers'],
    type: "url",
    url: "Human-All-NoTF.csv"
};

var state = {
    elements: '',
    id: 'rootDiv',
    style: {
        colorByLayer: true,
        colorByWeight: false,
        layerLabels: true,
        edgeColor: "#f5f5f5",
        backgroundColor: "#222222",
        labelColor: "#ffffff",
        planeSize: 10000,

        colorKey: true,
        key: {
            'WNT/Wingless': "#00ff00",
            Hedgehog: "#0000ff",
            Mutual: "#ff0000",
            None: "#d5d5d5"
        }

    },
    layout: { name: 'Manual' },
    directed: true,
    menuEnabled: true,
    interactive: true,
    camera: {
        type: '',
        position: {
            x: 0,
            y: 0,
            z: 500
        }
    },
    interLayerDistance: 1200,
    planes: true,
    nodesize: 20,
    normalisation: 'log',
    maxWeight: 0,
    physicsSettings: {
        springLength: 4000,
        springCoeff: 0.00008,
        gravity: -1.4,
        theta: 0.7,
        dragCoeff: 0.005,
        timeStep : 10,
        stableThreshold: 0.0009
    }
};

var state2 =  {
    container: '',
    elements: '',
    id: "cc",
    style: {
        colorByLayer: true,
        layerLabels: true,
        colorByWeight: true,
        edgeColor: "#ffffff",
        backgroundColor: "#222222",
        labelColor: "#ffffff",
        colorKey: true
    },
    // Dennis
    directed: true,
    menuEnabled: true,
    camera: {
        type: '',
        position: {
            x: 0,
            y: 0,
            z: 5000
        }
    },
    layout: {
        name: 'Circle'
    },
    interLayerDistance: 800,
    planes: false,
    nodesize: 100,
    normalisation: 'log',
    orderOfElements: {
        layers: [
            'Transcriptionalregulation',
            'Post-transcriptionalregulation',
            'Post-translationalmodification',
            'Directedprotein-proteininteraction',
            'Pathwayregulation',
            'Interactionbetweenpathwaymembers',
            'interactionfromexternaldatabases'
        ],
        nodes: [
            'Notch',
            'WNT/Wingless',
            'RTK',
            'TGF',
            'NHR',
            "JAK/STAT",
            "Hedgehog"
        ]
    },
    physicsSettings: {
        springLength: 1500,
        springCoeff: 0.00008,
        gravity: -2.0,
        theta: 0.8,
        dragCoeff: 0.02,
        timeStep : 10,
        stableThreshold: 0.009
    },
    interactive: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true
};


httpPostAsync("http://localhost:8080/subset", data, function (res) {
    var app = require('biojs-vis-munavi');
    var container = document.getElementById('rootDiv');
    container.style.height = '100%';

    var result = JSON.parse(res);
    var mutNetwork = result.network;
    var ccNetwork = result.cc;
    state.elements = mutNetwork;
    state2.elements = ccNetwork;

    //var row = document.createElement('div');
    //row.classList.add('row');
    //container.appendChild(row);
    //var left = document.createElement('div');
    //var right = document.createElement('div');
    //left.id = "mutual";
    //right.id = "cc";
    //left.classList.add("col-2");
    //right.classList.add("col-2");
    //row.appendChild(left);
    //row.appendChild(right);

    var mutual = new app(container, state);
    mutual.init();
    //var crossTalks = new app(right, state2);
    //crossTalks.init();
});

//var xhr = new XMLHttpRequest();
//xhr.onprogress = function () {
//    console.log("Loading ", xhr.responseText);
//};
//xhr.onload = function () {
//    console.log("Done! ");//, JSON.parse(xhr.responseText));
//
//};
//xhr.open("POST", "http://localhost:8080/subset", true);
//xhr.setRequestHeader("Content-Type", "application/json");
//xhr.send(JSON.stringify(data));


function httpPostAsync(url, data, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
            console.log("Success!");
            callback(xhttp.responseText, data.name);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));

}