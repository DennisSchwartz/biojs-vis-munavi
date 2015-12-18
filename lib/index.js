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

var Munavi = {
    /*
     1. Pass data to Munemo to create model
     2. Create vis panel with three.js scene
     3. Create state object
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

    }





    /*
     Pass / parse data and create model
     */



    /*
     Add objects to view
     */

    /*
     Call function/event on change
     */




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

