/**
 * Created by ds on 16/12/15.
 */

"use strict";

var utils = {
    merge: merge
};

module.exports = utils;

function merge( obj1, obj2 ) {

    for ( var key in obj1 ) {
        if ( obj1.hasOwnProperty( key ) ) {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}
//
//// Update Options file according to input
//if (options) {
//    for (var key in options) {
//        if (options.hasOwnProperty(key)) {
//            Options[key] = options[key];
//            console.log(key + ': ' + Options[key]);
//        }
//    }
//}




