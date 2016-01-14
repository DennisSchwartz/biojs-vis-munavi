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
        // find difference in state and update
        var parser = new Parser();
        console.log(parser.getInPath(state, paths));
        // Replace these parts in own state
    },


    /*
     Call function/event on change
     */
    onChange: function (callback) {
        this.changed = callback;
        //const state = this.getState();
        //const self = this;
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

    state.graphics.run();


}

module.exports = Munavi;

