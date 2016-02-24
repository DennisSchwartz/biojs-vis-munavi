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

var Munavi = {
    /*
     1. Pass data to Munemo to create model
     2. Create vis panel with three.js scene
     3. Create state object
     */

    /*
     Pass / parse data and create model
     */
    init: function ( opts ) {

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

        eventify(this.state);

        var self = this;
        this.state.on('change', function () {
            self.changed();
        });

        return this;

    },

    getState: function () {
        return this.state;
    },


    /*
     Add objects to view
     */
    update: function (state, paths) {

        // TODO: THIS IS NOT IMMUTABLE RIGHT NOW!!~

        // find difference in state and update
        var parser = new Parser();
        var updates = parser.getInPath(state, paths);
        parser.setInPath(this.state, paths, updates);
    },


    /*
     Call function/event on change
     */
    onChange: function (callback) {
        //const state = this.getState();
        //const self = this;
        //
        //this.state.visEl.addEventListener("mousemove", function (evt) {
        //   callback(evt);
        //});
        callback('No events set yet!');
    }

};

function createVisView ( state ) {

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

}

module.exports = Munavi;

