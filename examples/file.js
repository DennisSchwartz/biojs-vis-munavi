/**
 * Created by ds on 19/04/2016.
 */

var data = {
    type: "file",
    file: 'source_name;layer;target_name;layer\n\
NFKB1;Transcriptional regulation;PRKCE;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PAG1;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKCH;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MDS033;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PKN2;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKD1;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKCQ;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKCZ;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKG1;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKG2;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAPK4;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAPK8;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAPK9;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAPK10;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAP2K1;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAP2K2;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAP2K3;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAP2K5;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;MAP2K7;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;EIF2AK2;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRKX;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PRLR;Transcriptional regulation\n\
hsa-mir-371;Post-transcriptional regulation;ACVR1B;Post-transcriptional regulation\n\
NFKB1;Transcriptional regulation;PSEN1;Transcriptional regulation\n\
hsa-mir-371;Post-transcriptional regulation;ACVR2A;Post-transcriptional regulation\n\
NFKB1;Transcriptional regulation;PAK6;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;DUSP22;Transcriptional regulation\n\
hsa-mir-371;Post-transcriptional regulation;NUMBL;Post-transcriptional regulation\n\
hsa-mir-371;Post-transcriptional regulation;ACVR2B;Post-transcriptional regulation\n\
NFKB1;Transcriptional regulation;CDC42SE2;Transcriptional regulation\n\
PPARG;Transcriptional regulation;POC1A;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;CAMK1D;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PAK7;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;SMURF1;Transcriptional regulation\n\
hsa-mir-371;Post-transcriptional regulation;ULK2;Post-transcriptional regulation\n\
hsa-mir-371;Post-transcriptional regulation;PPARA;Post-transcriptional regulation\n\
NFKB1;Transcriptional regulation;HT019;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;BIRC6;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTH1R;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTK2;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;KIDINS220;Transcriptional regulation\n\
hsa-mir-372;Post-transcriptional regulation;RPS6KB1;Post-transcriptional regulation\n\
NFKB1;Transcriptional regulation;RPTOR;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTK6;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;SH3RF1;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTPN2;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTPN11;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTPRA;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;PTPRE;Transcriptional regulation\n\
NFKB1;Transcriptional regulation;hsa-mir-371;Post-transcriptional regulation\n\
RPS6KB1;Post-transcriptional regulation;hsa-mir-371;Post-transcriptional regulation\n\
PPARG;Transcriptional regulation; NFKB1;Transcriptional regulation'
};

var state = {
    elements: '',
    id: 'rootDiv',
    style: {
        colorByLayer: true,
        colorByWeight: false,
        layerLabels: true,
        edgeColor: "#f5f5f5",
        backgroundColor: "#000000",
        labelColor: "#ffffff",
        colorKey: false
    },
    layout: { name: 'ForceDirectedLayered' },
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
    interLayerDistance: 600,
    planes: false,
    nodesize: 12,
    normalisation: 'log',
    maxWeight: 0,
    physicsSettings: {
        springLength: 1000,
        springCoeff: 0.0008,
        gravity: -1.4,
        theta: 0.7,
        dragCoeff: 0.005,
        timeStep : 10,
        stableThreshold: 0.0009
    }
};


httpPostAsync("http://localhost:8080/create", data, function (res) {
    var app = require('biojs-vis-munavi');
    var container = document.getElementById('rootDiv');
    container.style.height = '100%';

    state.elements = JSON.parse(res);

    var crossTalks = new app(container, state);
    crossTalks.init();
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