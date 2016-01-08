/**
 * Created by Dennis Schwartz on 16/12/15.
 */

var THREE = require('three');
var TrackballControls = require('three.trackball');
var Layouts = require('./layouts');
var Fixed = Layouts.connectedMultilayer;
var ForceDirectedLayered = Layouts.independentMultilayer;
var Manual = Layouts.manual;
var R = require('ramda');
var Defaults = require('./defaults');

function Graphics ( state ) {

    var nodeUI = {};
    var linkUI = {};
    var stable = false;



    // Attach the current three instance to the state
    state.THREE = THREE;

    /*
     Create the three.js canvas/WebGL renderer
     */
    state.renderer = createRenderer( state.visEl );
    state.scene = new THREE.Scene();
    createCamera( state );
    state.nodeUI = nodeUI;
    state.linkUI = linkUI;



    /*
        Create Layout with elements in state
     */

    var layout = createLayout( state );

    /*
        Layouts specify renderers and UI builders
     */

    var nodeRenderer = layout.nodeRenderer;
    //var linkRenderer = layout.linkRenderer;

    /**
     * This sets the default node rendering function
     */

    var linkRenderer = function ( link ) {
        console.log(link);
        console.log(state.elements.elements[link.from]);

        var from = nodeUI[link.from.substring(2)];
        var to = nodeUI[link.to.substring(2)];
        link.geometry.vertices[0].set(from.position.x,
            from.position.y,
            from.position.z);
        link.geometry.vertices[1].set(to.position.x,
            to.position.y,
            to.position.z);
        link.geometry.verticesNeedUpdate = true;
    };
    var nodeUIBuilder = layout.nodeUIBuilder;
    var linkUIBuilder = layout.linkUIBuilder;

    /*
        Create look of every element
     */

    var nodes = state.elements.nodelayers;
    var edges = state.elements.edges;

    nodes.forEach(function (n) {
        createNodeUI(state.elements.elements['nl' + n.data.id]);
    });
    edges.forEach(function (e) {
        var toID = e.data.target.substring(2);
        var fromID = e.data.source.substring(2);
        var link = state.elements.elements[ 'e' + fromID + toID ];
        createLinkUI(link);
    });

    console.log(state);

    /*
        Create controls if set
     */

    if (state.zoomingEnabled) {
        controls = new TrackballControls(state.camera, state.renderer.domElement);
        controls.panSpeed = 0.8;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.addEventListener('change', renderFrame);
    }

    /**
     * Create the UI for each node-layer in the network and add them to the scene
     * @param node
     */

    function createNodeUI(node) {
        var id = node.data['id'];
        var ui = node.ui;//nodeUI[id];
        if (!ui) {
            ui = nodeUIBuilder(node);
            node.ui = ui;
            node.position = layout.getNodePosition(node);
            //ui.pos = layout.getNodePosition(node);
            var layers = R.map(function (i) { return i.data['id'] }, state.elements.layers);
            node.position.z = layers.indexOf('l' + node.data['layer']) * state.interLayerDistance;
            //ui.node = node.data['node'];
            //nodeUI[id] = ui;
            //node.pos = ui.pos;
        }
        state.scene.add(node.ui);
    }


    /**
     * Create the UI for each link and add it to the scene
     * @param edge
     */

    function createLinkUI(edge) {
        var id = edge.data['id'];
        var ui = edge.ui;//linkUI[id];
        if (!ui) {
            var from = edge.data['source'];
            var to = edge.data['target'];
            ui = linkUIBuilder(edge);
            ui.from = from;
            ui.to = to;
            //linkUI[id] = ui;
            edge.ui = ui;
        }
        state.scene.add(edge.ui);
    }



    /**
     * This is the main Animation loop calling requestAnimationFrame on window
     * which in turn calls back to this function
     */

    function run () {

        //if ( stop ) return;
        window.requestAnimationFrame( run );
        if (!stable) {
            stable = layout.step();
        }
        renderFrame ();
        controls.update ();

    }

    /**
     * Create three.js state
     * @param state
     * @returns {THREE.PerspectiveCamera}
     */

    function createCamera ( state ) {
        var container = state.renderer.domElement;
        var camera;
        console.log(container.width);
        if ( state.cameraType === 'orthographic' ) {
            camera = new THREE.OrthographicCamera( container.width / 2,
                container.width / -2,
                container.height / 2,
                container.height / -2, 1, 1000 );
            camera.position.x = 200;
            camera.position.y = 100;
            camera.position.z = 300;
            camera.lookAt(state.scene.position);
        } else { // Default case
            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 30000);
        }
        camera.position.z = 400;
        state.camera = camera;
    }


    /**
     * This function calculates and sets
     * the current position of each ui-element each frame.
     */

    function renderFrame() {

        //Alternative version
        nodes.forEach(function ( node ) {
            var n = state.elements.elements[ 'nl' + node.data.id ];
            Defaults.newRenderer( n );
        });

        edges.forEach(function ( edge ) {
            var toID = edge.data.target.substring(2);
            var fromID = edge.data.source.substring(2);
            var link = state.elements.elements[ 'e' + fromID + toID ];
            var from = state.elements.elements[ edge.data.source ];
            var to = state.elements.elements[ edge.data.target ];
            link.ui.geometry.vertices[0].set(from.ui.position.x,
                from.ui.position.y,
                from.ui.position.z);
            link.ui.geometry.vertices[1].set(to.ui.position.x,
                to.ui.position.y,
                to.ui.position.z);
            link.ui.geometry.verticesNeedUpdate = true;
        });
        //Object.keys(nodeUI).forEach(function (id) {
        //    nodeRenderer(nodeUI[id])
        //});
        //Object.keys(linkUI).forEach(function (id) {
        //    linkRenderer(linkUI[id])
        //});

        state.renderer.render(state.scene, state.camera);

    }

    function rebuildUI () {
        Object.keys(nodeUI).forEach(function (nodeId) {
            scene.remove(nodeUI[nodeId]);
        });
        nodeUI = {};

        Object.keys(linkUI).forEach(function (linkId) {
            scene.remove(linkUI[linkId]);
        });
        linkUI = {};


        network.get( 'nodes' ).forEach(function (n) {
            createNodeUI(n);
        });
        network.get( 'edges' ).forEach(function (e) {
            createLinkUI(e);
        });

    }

    /**
     * Check if the given Layout was already instantiated or is only a name.
     * If a name -> create new Layout
     * @param network
     * @param settings
     * @returns {*}
     */

    function createLayout ( state ) {

        var input = state.layout;
        input = input === undefined ? 'ForceDirectedLayered' : input.name;

        network = state.elements;
        console.log(state.settings);

        if ( typeof input === 'string' ) {

            var layout;

            if ( input === 'Fixed' ) {
                return new Fixed( network, state.settings );
            }

            if ( input === 'ForceDirectedLayered' ) {
                return new ForceDirectedLayered( network, state );
            }

            if ( input === 'ForceDirected' ) {
                return new ForceDirected(network, settings);
            }

            if ( input === 'Manual' ) {
                return new Manual( state.elements );
            }

        } else if ( input ) {

            return input;

        }

        throw new Error ( "The layout " + input + " could not be created!" );

    }

    return {

        THREE: THREE,


        run: run,

        resetStable: function () {
            stable = false;
            layout.resetStable();
        },


        /**
         * You can set the nodeUIBuilder function yourself
         * allowing for custom UI settings
         * @param callback
         * @returns {API}
         */

        setNodeUI: function (callback) {
            nodeUIBuilder = callback;
            rebuildUI();
            return this;
        },


        /**
         * You can set the nodeUIBuilder function yourself
         * allowing for custom UI settings
         * @param callback
         * @returns {API}
         */

        setLinkUI: function (callback) {
            linkUIBuilder = callback;
            rebuildUI();
            return this;
        }
    };

    /**
     * Create the three.js renderer
     * @param container
     * @returns {*}
     */

    function createRenderer ( container ) {

        var webGlSupport = webgl_detect();
        var renderer = webGlSupport ? new THREE.WebGLRenderer( container ) : new THREE.CanvasRenderer( container );

        var width = container.clientWidth || window.innerWidth;
        var height = container.clientHeight || window.innerHeight;
        renderer.setSize( width, height );
        renderer.setClearColor( 0xffffff, 1 );
        console.log(renderer);

        if ( container ) {
            container.appendChild( renderer.domElement );
        } else {
            document.body.appendChild( renderer.domElement );
        }

        return renderer;
    }

    /**
     * http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
     * @param return_context
     * @returns {*}
     */
    function webgl_detect(return_context) {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context = false;
            for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        if (return_context) {
                            // return WebGL object if the function's argument is present
                            return {name:names[i], gl:context};
                        }
                        // else, return just true
                        return true;
                    }
                } catch(e) {}
            }
            // WebGL is supported, but disabled
            return false;
        }
        // WebGL not supported
        return false;
    }


}

module.exports = Graphics;