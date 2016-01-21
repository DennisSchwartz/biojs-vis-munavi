/**
 * Created by Tamas Kadlecsik
 */

var R = require('ramda');

var Parser = function (){
    "use strict";
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    // TODO: remove dependency!
    var parseSelector = (function(){
        // Whether it is in the form of single index, or a range as [1:5] => [1,2,3,4]
        var isRangeSelector = R.test(/:/);
        // Make the transformation [1:5] => [1,2,3,4]
        var parseRange = R.compose(R.apply(R.range), R.map(R.unary(parseInt)), R.split(':'));
        return R.compose(
            R.uniq,
            R.flatten,
            R.map(
                R.ifElse(isRangeSelector, parseRange, R.unary(parseInt))
            ),
            R.split(',')
        );
    })();

    function range(start, stop){
        var a=[start];
        var b=start;
        while(++b<stop){a.push(b)}
        return a;
    }
    return {
        getInPath: function (obj, path) {
            var pathArray = path.split('.').map(function (p) {
               return p.replace(']', '').split('[')
            });
            var selectedObj = obj;
            var indices = [];
            var key;
            var indexSelector;
            var tempContainer = [];
            pathArray.forEach(function(selector){
                key = selector[0];
                if(selector.length === 1){
                    selectedObj = isArray(selectedObj) ?
                        selectedObj.map(function(obj){return obj[key]}) : selectedObj[key];
                }else if(selector.length === 2){
                    indexSelector = selector[1];
                    // See if selectedObj is an object
                    if ( typeof selectedObj[key] === 'object' ){
                        indices = indexSelector === '*' ? Object.keys(selectedObj[key]) : parseSelector(indexSelector);
                    } else {
                        indices = indexSelector === '*' ? range(0, selectedObj[key].length) : parseSelector(indexSelector);
                    }
                    console.log(indices);
                    indices.forEach(function(i){
                        tempContainer.push(selectedObj[key][i]);
                    });
                    selectedObj = tempContainer;
                    tempContainer = [];
                }else throw new Error('something is not right with your selector here ' + selector);
                selectedObj = isArray(selectedObj) ?
                    selectedObj.length === 1 ? selectedObj[0] : selectedObj
                    : selectedObj
            });
            return selectedObj;
        },
        setInPath: function setInPath(obj, path, value){
            var pathArray = path.split('.').map(function (p) {
                return p.replace(']', '').split('[')
            });
            var selectedObj = obj;
            var indices = [];
            var key;
            var indexSelector;
            var tempContainer = [];
            var c = 0;
            pathArray.forEach(function(selector) {
                key = selector[0];
                if(selector.length === 1){
                    selectedObj = isArray(selectedObj) ?
                        selectedObj.map(function(obj){return obj[key]}) : selectedObj[key];
                }else if(selector.length === 2){
                    indexSelector = selector[1];
                    indices = indexSelector === '*' ? range(0, selectedObj[key].length) : parseSelector(indexSelector);
                    indices.forEach(function(i){
                        tempContainer.push(selectedObj[key][i]);
                    });
                    selectedObj = tempContainer;
                    tempContainer = [];
                }else throw new Error('something is not right with your selector here ' + selector);

                if(c++ === pathArray.length - 2){
                    selector = pathArray[c];
                    key = selector[0];
                    if(selector.length === 1){
                        if(isArray(selectedObj))
                            selectedObj.forEach(function(o){
                                o[key] = value;
                            });
                        else {
                            selectedObj[key] = value;
                        }
                    }else if(selector.length === 2){
                        indexSelector = selector[1];
                        indices = indexSelector === '*' ? range(0, selectedObj[key].length) : parseSelector(indexSelector);
                        for(var i in indices){
                            if ( indices.hasOwnProperty(i) ) {
                                selectedObj[key][i] = value;
                            }

                        }
                    }else throw new Error('something is not right with your selector here ' + selector);

                }
            });
            return selectedObj;
        }
    }
};

module.exports = Parser;