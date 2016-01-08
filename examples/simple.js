// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-munavi");

var container = document.getElementById('cytoscape');

// state is the object that describes the whole view
var state = {
    container: container,
    elements: JSON.parse('{"elements":{"nA":{"group":"nodes","data":{"id":"nA","label":""}},"l1":{"group":"layers","data":{"id":"l1"}},"nlA1":{"group":"nodelayers","data":{"node":"A","layer":"1","id":"A1"}},"nB":{"group":"nodes","data":{"id":"nB","label":""}},"nlB1":{"group":"nodelayers","data":{"node":"B","layer":"1","id":"B1"}},"eA1B1":{"group":"edges","data":{"source":"nlA1","target":"nlB1","id":"nlA1nlB1","weight":0}},"nC":{"group":"nodes","data":{"id":"nC","label":""}},"nlC1":{"group":"nodelayers","data":{"node":"C","layer":"1","id":"C1"}},"eA1C1":{"group":"edges","data":{"source":"nlA1","target":"nlC1","id":"nlA1nlC1","weight":0}},"nD":{"group":"nodes","data":{"id":"nD","label":""}},"nlD1":{"group":"nodelayers","data":{"node":"D","layer":"1","id":"D1"}},"eA1D1":{"group":"edges","data":{"source":"nlA1","target":"nlD1","id":"nlA1nlD1","weight":0}},"nE":{"group":"nodes","data":{"id":"nE","label":""}},"nlE1":{"group":"nodelayers","data":{"node":"E","layer":"1","id":"E1"}},"eA1E1":{"group":"edges","data":{"source":"nlA1","target":"nlE1","id":"nlA1nlE1","weight":0}},"nF":{"group":"nodes","data":{"id":"nF","label":""}},"nlF1":{"group":"nodelayers","data":{"node":"F","layer":"1","id":"F1"}},"eA1F1":{"group":"edges","data":{"source":"nlA1","target":"nlF1","id":"nlA1nlF1","weight":0}},"eB1C1":{"group":"edges","data":{"source":"nlB1","target":"nlC1","id":"nlB1nlC1","weight":0}},"eB1D1":{"group":"edges","data":{"source":"nlB1","target":"nlD1","id":"nlB1nlD1","weight":0}},"eB1E1":{"group":"edges","data":{"source":"nlB1","target":"nlE1","id":"nlB1nlE1","weight":0}},"eB1F1":{"group":"edges","data":{"source":"nlB1","target":"nlF1","id":"nlB1nlF1","weight":0}},"eC1D1":{"group":"edges","data":{"source":"nlC1","target":"nlD1","id":"nlC1nlD1","weight":0}},"eC1E1":{"group":"edges","data":{"source":"nlC1","target":"nlE1","id":"nlC1nlE1","weight":0}},"eC1F1":{"group":"edges","data":{"source":"nlC1","target":"nlF1","id":"nlC1nlF1","weight":0}},"eD1E1":{"group":"edges","data":{"source":"nlD1","target":"nlE1","id":"nlD1nlE1","weight":0}},"eD1F1":{"group":"edges","data":{"source":"nlD1","target":"nlF1","id":"nlD1nlF1","weight":0}},"eE1F1":{"group":"edges","data":{"source":"nlE1","target":"nlF1","id":"nlE1nlF1","weight":0}},"l2":{"group":"layers","data":{"id":"l2"}},"nlA2":{"group":"nodelayers","data":{"node":"A","layer":"2","id":"A2"}},"nlB2":{"group":"nodelayers","data":{"node":"B","layer":"2","id":"B2"}},"eA2B2":{"group":"edges","data":{"source":"nlA2","target":"nlB2","id":"nlA2nlB2","weight":0}},"nlC2":{"group":"nodelayers","data":{"node":"C","layer":"2","id":"C2"}},"eA2C2":{"group":"edges","data":{"source":"nlA2","target":"nlC2","id":"nlA2nlC2","weight":0}},"nlD2":{"group":"nodelayers","data":{"node":"D","layer":"2","id":"D2"}},"eA2D2":{"group":"edges","data":{"source":"nlA2","target":"nlD2","id":"nlA2nlD2","weight":0}},"nlE2":{"group":"nodelayers","data":{"node":"E","layer":"2","id":"E2"}},"eA2E2":{"group":"edges","data":{"source":"nlA2","target":"nlE2","id":"nlA2nlE2","weight":0}},"nlF2":{"group":"nodelayers","data":{"node":"F","layer":"2","id":"F2"}},"eA2F2":{"group":"edges","data":{"source":"nlA2","target":"nlF2","id":"nlA2nlF2","weight":0}},"eB2C2":{"group":"edges","data":{"source":"nlB2","target":"nlC2","id":"nlB2nlC2","weight":0}},"eB2D2":{"group":"edges","data":{"source":"nlB2","target":"nlD2","id":"nlB2nlD2","weight":0}},"eB2E2":{"group":"edges","data":{"source":"nlB2","target":"nlE2","id":"nlB2nlE2","weight":0}},"eB2F2":{"group":"edges","data":{"source":"nlB2","target":"nlF2","id":"nlB2nlF2","weight":0}},"eC2D2":{"group":"edges","data":{"source":"nlC2","target":"nlD2","id":"nlC2nlD2","weight":0}},"eC2E2":{"group":"edges","data":{"source":"nlC2","target":"nlE2","id":"nlC2nlE2","weight":0}},"eC2F2":{"group":"edges","data":{"source":"nlC2","target":"nlF2","id":"nlC2nlF2","weight":0}},"eD2E2":{"group":"edges","data":{"source":"nlD2","target":"nlE2","id":"nlD2nlE2","weight":0}},"eD2F2":{"group":"edges","data":{"source":"nlD2","target":"nlF2","id":"nlD2nlF2","weight":0}},"eE2F2":{"group":"edges","data":{"source":"nlE2","target":"nlF2","id":"nlE2nlF2","weight":0}},"eA1A2":{"group":"edges","data":{"source":"nlA1","target":"nlA2","id":"nlA1nlA2","weight":0}},"eB1B2":{"group":"edges","data":{"source":"nlB1","target":"nlB2","id":"nlB1nlB2","weight":0}},"eC1C2":{"group":"edges","data":{"source":"nlC1","target":"nlC2","id":"nlC1nlC2","weight":0}},"eD1D2":{"group":"edges","data":{"source":"nlD1","target":"nlD2","id":"nlD1nlD2","weight":0}},"eE1E2":{"group":"edges","data":{"source":"nlE1","target":"nlE2","id":"nlE1nlE2","weight":0}},"eF1F2":{"group":"edges","data":{"source":"nlF1","target":"nlF2","id":"nlF1nlF2","weight":0}}},"nodes":[{"group":"nodes","data":{"id":"nA","label":""}},{"group":"nodes","data":{"id":"nB","label":""}},{"group":"nodes","data":{"id":"nC","label":""}},{"group":"nodes","data":{"id":"nD","label":""}},{"group":"nodes","data":{"id":"nE","label":""}},{"group":"nodes","data":{"id":"nF","label":""}}],"layers":[{"group":"layers","data":{"id":"l1"}},{"group":"layers","data":{"id":"l2"}}],"nodelayers":[{"group":"nodelayers","data":{"node":"A","layer":"1","id":"A1"}},{"group":"nodelayers","data":{"node":"B","layer":"1","id":"B1"}},{"group":"nodelayers","data":{"node":"C","layer":"1","id":"C1"}},{"group":"nodelayers","data":{"node":"D","layer":"1","id":"D1"}},{"group":"nodelayers","data":{"node":"E","layer":"1","id":"E1"}},{"group":"nodelayers","data":{"node":"F","layer":"1","id":"F1"}},{"group":"nodelayers","data":{"node":"A","layer":"2","id":"A2"}},{"group":"nodelayers","data":{"node":"B","layer":"2","id":"B2"}},{"group":"nodelayers","data":{"node":"C","layer":"2","id":"C2"}},{"group":"nodelayers","data":{"node":"D","layer":"2","id":"D2"}},{"group":"nodelayers","data":{"node":"E","layer":"2","id":"E2"}},{"group":"nodelayers","data":{"node":"F","layer":"2","id":"F2"}}],"edges":[{"group":"edges","data":{"source":"nlA1","target":"nlB1","id":"nlA1nlB1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlC1","id":"nlA1nlC1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlD1","id":"nlA1nlD1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlE1","id":"nlA1nlE1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlF1","id":"nlA1nlF1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlC1","id":"nlB1nlC1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlD1","id":"nlB1nlD1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlE1","id":"nlB1nlE1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlF1","id":"nlB1nlF1","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlD1","id":"nlC1nlD1","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlE1","id":"nlC1nlE1","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlF1","id":"nlC1nlF1","weight":0}},{"group":"edges","data":{"source":"nlD1","target":"nlE1","id":"nlD1nlE1","weight":0}},{"group":"edges","data":{"source":"nlD1","target":"nlF1","id":"nlD1nlF1","weight":0}},{"group":"edges","data":{"source":"nlE1","target":"nlF1","id":"nlE1nlF1","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlB2","id":"nlA2nlB2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlC2","id":"nlA2nlC2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlD2","id":"nlA2nlD2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlE2","id":"nlA2nlE2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlF2","id":"nlA2nlF2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlC2","id":"nlB2nlC2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlD2","id":"nlB2nlD2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlE2","id":"nlB2nlE2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlF2","id":"nlB2nlF2","weight":0}},{"group":"edges","data":{"source":"nlC2","target":"nlD2","id":"nlC2nlD2","weight":0}},{"group":"edges","data":{"source":"nlC2","target":"nlE2","id":"nlC2nlE2","weight":0}},{"group":"edges","data":{"source":"nlC2","target":"nlF2","id":"nlC2nlF2","weight":0}},{"group":"edges","data":{"source":"nlD2","target":"nlE2","id":"nlD2nlE2","weight":0}},{"group":"edges","data":{"source":"nlD2","target":"nlF2","id":"nlD2nlF2","weight":0}},{"group":"edges","data":{"source":"nlE2","target":"nlF2","id":"nlE2nlF2","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlA2","id":"nlA1nlA2","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlB2","id":"nlB1nlB2","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlC2","id":"nlC1nlC2","weight":0}},{"group":"edges","data":{"source":"nlD1","target":"nlD2","id":"nlD1nlD2","weight":0}},{"group":"edges","data":{"source":"nlE1","target":"nlE2","id":"nlE1nlE2","weight":0}},{"group":"edges","data":{"source":"nlF1","target":"nlF2","id":"nlF1nlF2","weight":0}}]}'),
    style: [ {
        selector: 'node',
        style: {
            'content': 'data(id)'
        }
    }],
    ready: function(evt){ /* ... */ },

    zoom: 1,
    pan: { x: 0, y: 0 },

    // Dennis
    menuEnabled: true,
    cameraType: '',
    layout: {
        name: 'ForceDirectedLayered'
    },
    interLayerDistance: 120,

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
    initrender: function(evt){ /* ... */ },
    renderer: { /* ... */ }
};

var instance = app.init({el: rootDiv, state: state});
