});
// Read file

var xhr = new XMLHttpRequest();
xhr.onprogress = function (evt) {
    console.log(evt);
};
xhr.open("POST", "http://localhost:8080/file", true);
xhr.setRequestHeader("Content-Type", "text/plain");
xhr.send(null);

xhr.onreadystatechange = function () {
    if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
        console.log("Success!");
    }
};

// Instantiate MuNAV with file data

// Get data model from MuNAV

// Pass data to cc-analysis server

// Call update function with results



//function httpPostAsync(url, data, callback) {
//    var xhttp = new XMLHttpRequest();
//    xhttp.onreadystatechange = function () {
//        if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
//            console.log("Success!");
//            callback(xhttp.responseText);
//        }
//    };
//    xhttp.open("POST", url, true);
//    xhttp.setRequestHeader("Content-Type", "application/json");
//    xhttp.send(JSON.stringify(data));
//}