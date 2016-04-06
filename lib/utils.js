/**
 * Created by ds on 16/12/15.
 */

"use strict";

var utils = {
    merge: merge
};

module.exports = utils;

function merge( obj1, obj2 ) {
    if (!obj1) obj1 = {};
    if (obj2) {
        for (var key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (key === 'container') {
                    obj1[key] = obj2[key];
                } else if (typeof obj2[key] === 'object') {
                    obj1[key] = merge(obj1[key], obj2[key]);
                } else {
                    obj1[key] = obj2[key];
                }
            }
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




