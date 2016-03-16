/*
 * biojs-vis-munavi
 * https://github.com/DennisSchwartz/biojs-vis-munavi
 *
 * Copyright (c) 2015 Dennis Schwartz
 * Licensed under the MIT license.
 */

/**
 @class munavi
 */

var Utils = require('./utils');
var Defaults = require('./defaults');
var Graphics = require('./graphics');
var JSONPath = require('jsonpath-plus');
var eventify = require('ngraph.events');
var Parser = require('./parser');
var $ = require('jquery');
var THREE = require('three');

function Munavi () {}
        /*
         1. Pass data to Munemo to create model
         2. Create vis panel with three.js scene
         3. Create state object
         */

        /*
         Pass / parse data and create model
         */
        Munavi.prototype.init = function ( opts ) {

            /*
             Parse state object & fill with defaults
             */
            this.state = opts.state === undefined ? Defaults.state : Utils.merge(Defaults.state, opts.state);
            // Set container
            if (!this.state.container) {
                this.state.container = opts.el;
            }
            //this.el = this.state.container ? this.state.container : opts.el;
            //this.el.style.height = window.innerHeight ||
            //    document.documentElement.clientHeight || document.body.clientHeight;

            /*
             Create visualisation view
             */

            createVisView( this.state );

            console.log(this.state);

            //eventify(this.state);

            //var self = this;
            //this.state.on('change', function () {
            //    self.changed();
            //});

            return this;

        };

        Munavi.prototype.getState = function () {
            return this.state;
        };


        /*
         Add objects to view
         */
        Munavi.prototype.update = function (state, paths) {

            // TODO: THIS IS NOT IMMUTABLE RIGHT NOW!!~

            // find difference in state and update
            var parser = new Parser();
            var updates = parser.getInPath(state, paths);
            parser.setInPath(this.state, paths, updates);
        };


        /*
         Call function/event on change
         */
        Munavi.prototype.onChange = function (callback) {
            //const state = this.getState();
            //const self = this;
            //
            //this.state.visEl.addEventListener("mousemove", function (evt) {
            //   callback(evt);
            //});
            callback('No events set yet!');
        };



function createVisView ( state ) {

    // Show loading sign
    showLoadingAnimation( state );

    /*
     Create DOM-Element
     */
    var visEl = document.createElement('div');
    visEl.id = 'vis';
    state.container.appendChild(visEl);
    // Set dimensions :
    visEl.style.height = '100%';
    if ( state.menuEnabled ) {
        visEl.classList.add('col-md-10');
    } else {
        visEl.classList.add('col-md-12');
    }

    state.visEl = visEl;

    /*
        If there is no graphics module yet, add one
     */
    state.graphics = state.graphics ? state.graphics : Graphics( state );

    //state.graphics.setNodeUI(function ( node ) {
    //
    //    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    //    var geometry = new THREE.SphereGeometry(7);
    //
    //    return new THREE.Mesh(geometry, material);
    //
    //});

    //if ( state.style.colorByLayer ) {
    //    state.graphics.setNodeUI(function (node) {
    //        console.log(state);
    //        var size = state.nodesize || 12;
    //        var nodeGeometry = new THREE.SphereGeometry(size);
    //        var color_ = 0x000000;
    //        for (var i=0;i<state.elements.layers.length;i++) {
    //            if ( 'l' + node.data['layer'] === state.elements.layers[i].data.id ) {
    //                color_ = Defaults.nodeColors[i];
    //            }
    //        }
    //        var nodeMaterial = new THREE.MeshBasicMaterial({ color: color_ });
    //        var sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
    //        sphere.myColor = color_;
    //        sphere.myId = node.id;
    //        sphere.isect = true;
    //        return sphere;
    //    });
    //}
    if ( state.directed ) {
        state.graphics.setNodeUI(function (node) {
            var size = state.nodesize || 12;
            var nodeGeometry = new THREE.CylinderGeometry( size, size, 20, 32 );
            var color_ = 0x000000;
            for (var i=0;i<state.elements.nodes.length;i++) {
                if ( 'n' + node.data['node'] === state.elements.nodes[i].data.id ) {
                    color_ = Defaults.nodeColors[i];
                }
            }
            var nodeMaterial = new THREE.MeshBasicMaterial({ color: color_ });
            var sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
            sphere.myColor = color_;
            sphere.myId = node.id;
            sphere.isect = true;
            // Set them to be upright
            sphere.rotateOnAxis(new THREE.Vector3(1, 0, 0), 1.57079633);
            return sphere;
        });
    }


    state.graphics.run();
    loadingFinished( state );

    // Add layer labels
    if ( state.style.layerLabels ) {
        state.elements.layers.forEach(function (l) {
            var sprite = makeTextSprite(l.data.id.substring(1), { fontsize: 18 });
            sprite.position.set(0, 0, state.elements.layers.indexOf(l) * state.interLayerDistance);
            state.scene.add(sprite);
            console.log(l.data.id);
        })
    }

}

function showLoadingAnimation( state ) {
    var modal = document.createElement("div");
    modal.id = 'loadingAnimation';
    modal.classList.add("modal");
    modal.innerHTML += "<h1>Loading...</h1>";
    var body  = document.getElementsByTagName("body");
    console.log(state.container);
    state.container.appendChild(modal);
}

function loadingFinished( state ) {
    var modal = document.getElementById("loadingAnimation");
    if (modal) {
        state.container.removeChild(modal);
    }
}

// From: http://stackoverflow.com/questions/23514274/three-js-2d-text-sprite-labels
function makeTextSprite( message, parameters )
{

    var fontface = parameters.fontface || 'Helvetica';
    var fontsize = parameters.fontsize || 70;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText(message);

    // text color
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.fillText(message, 0, fontsize);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(600, 300, 1.0);

    //if ( parameters === undefined ) parameters = {};
    //var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    //var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    //var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    //var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    //var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    //var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };
    //
    //var canvas = document.createElement('canvas');
    //console.log(canvas);
    //var context = canvas.getContext('2d');
    //context.font = "Bold " + fontsize + "px " + fontface;
    //var metrics = context.measureText( message );
    //canvas.setAttribute('height', metrics.height);
    //canvas.setAttribute('width', metrics.width);
    //context.fillText(message, 100, 100);


    //
    //context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    //context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    //
    //context.lineWidth = borderThickness;
    //roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);
    //
    //context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    //context.fillText( message, borderThickness, fontsize + borderThickness);

    //var texture = new THREE.Texture(canvas);
    //texture.needsUpdate = true;
    //console.log(texture);
    //var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    //var sprite = new THREE.Sprite( spriteMaterial );
    //sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;
}

// From: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Sprite-Text-Labels.html
// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

module.exports = Munavi;

