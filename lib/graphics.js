/**
 * Created by Dennis Schwartz on 16/12/15.
 */

var THREE = require('three');
var TrackballControls = require('three.trackball');
var OrthographicTrackballControls = require('three.orthographictrackball');
var Layouts = require('./layouts');
var Fixed = Layouts.connectedMultilayer;
var ForceDirectedLayered = Layouts.independentMultilayer;
var Manual = Layouts.manual;
var R = require('ramda');
var Defaults = require('./defaults');

function Graphics ( state ) {

    var stable = false;
    var maxWeight = state.elements.maxWeight;


    // Attach the current three instance to the state
    state.THREE = THREE;

    /*
     Create the three.js canvas/WebGL renderer
     */
    state.renderer = createRenderer( state.visEl );
    state.scene = new THREE.Scene();
    createCamera( state );

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

    //var linkRenderer = function ( link ) {
    //    console.log(link);
    //    console.log(state.elements.elements[link.from]);
    //
    //    var from = nodeUI[link.from.substring(2)];
    //    var to = nodeUI[link.to.substring(2)];
    //    link.geometry.vertices[0].set(from.position.x,
    //        from.position.y,
    //        from.position.z);
    //    link.geometry.vertices[1].set(to.position.x,
    //        to.position.y,
    //        to.position.z);
    //    link.geometry.verticesNeedUpdate = true;
    //};

    var nodeUIBuilder = layout.nodeUIBuilder;
    var linkUIBuilder = layout.linkUIBuilder;

    /*
     Create ui (look) of every element and add it to the element object
     */

    var nodes = state.elements.nodelayers; // TODO: Save only IDs in these lists
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



    /**
     * Create the UI for each node-layer in the network and add them to the scene
     * @param node
     */

    function createNodeUI(node) {
        if (!node.ui) {
            node.ui = nodeUIBuilder(node);
            console.log('hello!');
            node.position = layout.getNodePosition(node);
            var layers = R.map(function (i) { return i.data['id'] }, state.elements.layers);
            node.position.z = layers.indexOf('l' + node.data['layer']) * state.interLayerDistance;
        }
        state.scene.add(node.ui);
        //console.log("added");
        //console.log(node.ui);
    }


    /**
     * Create the UI for each link and add it to the scene
     * @param link
     */

    function createLinkUI(link) {
        if (!link.ui) {
            var from = link.data['source'];
            var to = link.data['target'];
            link.ui = linkUIBuilder(link);
            link.ui.from = from;
            link.ui.to = to;
        }
        state.scene.add(link.ui);
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
        state.controls.update ();

    }

    /**
     * Create three.js state
     * @param state
     * @returns {THREE.PerspectiveCamera}
     */

    function createCamera ( state ) {
        var container = state.renderer.domElement;
        var camera;
        var controls;
        if ( state.cameraType === 'orthographic' ) {
            // Create camera
            camera = new THREE.OrthographicCamera( container.width / 2,
                container.width / -2,
                container.height / 2,
                container.height / -2, 1, 1000 );
            camera.position.x = 200;
            camera.position.y = 100;
            camera.position.z = 300;
            camera.lookAt(state.scene.position);
            // Create corresponding controls if necessary
            if ( state.zoomingEnabled ) controls = new OrthographicTrackballControls(camera, state.renderer.domElement);
        } else { // Default case
            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 30000);
            if ( state.zoomingEnabled ) controls = new TrackballControls(camera, state.renderer.domElement);
        }
        camera.position.z = 400;
        state.camera = camera;

        if (state.zoomingEnabled) {
            controls.panSpeed = 0.8;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.addEventListener('change', renderFrame);
            state.controls = controls;
        }
    }


    /**
     * This function calculates and sets
     * the current position of each ui-element each frame.
     */

    function renderFrame() {

        //Alternative version
        nodes.forEach(function ( node ) {
            var n = state.elements.elements[ 'nl' + node.data.id ];
            nodeRenderer( n );
        });

        if ( state.directed ) {
            var arrowScale = 0.25;
            edges.forEach(function ( edge ) {
                var toID = edge.data.target.substring(2);
                var fromID = edge.data.source.substring(2);
                var link = state.elements.elements[ 'e' + fromID + toID ];
                var from = state.elements.elements[ edge.data.source ];
                var to = state.elements.elements[ edge.data.target ];

                var newSourcePos = new THREE.Vector3(from.ui.position.x,
                    from.ui.position.y,
                    from.ui.position.z);
                var newTargetPos = new THREE.Vector3(to.ui.position.x,
                    to.ui.position.y,
                    to.ui.position.z);
                var arrowVec = newTargetPos.clone().sub(newSourcePos);
                // targetPos + norm(neg(arrowVec)) * (nodesize / 2)
                var nodeRadVec = arrowVec.clone().negate().normalize().multiplyScalar(state.nodesize || 6);
                var cursor = newTargetPos.clone().add(nodeRadVec); // point
                link.ui.geometry.vertices[0].set(cursor.x, cursor.y, cursor.z);
                link.ui.geometry.vertices[3].set(cursor.x, cursor.y, cursor.z);
                cursor.add(nodeRadVec.multiplyScalar(1.5)); //arrowHeadBase
                var arrowHeadBase = cursor.clone();
                var flanker = nodeRadVec.clone().cross(new THREE.Vector3(0,0,1)).multiplyScalar(arrowScale);
                var w = link.data.weight || 1;
                var factor = 1;
                if ( maxWeight === 0 ) {
                    factor = .6 - (.6 / (w + .1));
                } else {
                    if ( state.normalisation === 'log' ) {
                        factor = 0.6 * ( Math.log(w) / Math.log(maxWeight) );
                    } else {
                        factor = 0.6 * ( w / maxWeight );
                    }
                }
                var ribboner = flanker.clone().multiplyScalar(factor);
                var flank1 = cursor.clone().add(flanker); //flank 1
                link.ui.geometry.vertices[1].set(flank1.x, flank1.y, flank1.z);
                flanker.add(flanker.negate().multiplyScalar(arrowScale * 2));
                cursor.add(flanker); //flank 2
                link.ui.geometry.vertices[2].set(cursor.x, cursor.y, cursor.z);
                // Move to Ribbon 1
                cursor = arrowHeadBase.clone().add(ribboner);
                link.ui.geometry.vertices[4].set(cursor.x, cursor.y, cursor.z);
                // Move to Ribbon 2
                cursor = arrowHeadBase.clone().add(ribboner.negate());
                link.ui.geometry.vertices[5].set(cursor.x, cursor.y, cursor.z);
                var temp = newTargetPos.clone().add(newSourcePos).divideScalar(2);
                // Move to source
                // RibbonSrc1
                cursor = newSourcePos.clone().add(ribboner).add(nodeRadVec.negate().multiplyScalar(1.3));
                link.ui.geometry.vertices[6].set(cursor.x, cursor.y, cursor.z);
                // RibbonSrc2
                cursor = newSourcePos.clone().add(ribboner.negate()).add(nodeRadVec);
                link.ui.geometry.vertices[7].set(cursor.x, cursor.y, cursor.z);
                link.ui.material.color.set(0x000000);
                //link.ui.material.transparent = true;
                //link.ui.material.opacity = 0.4;

                link.ui.geometry.verticesNeedUpdate = true;
                //link.ui.geometry.elementsNeedUpdate = true;
                //var distance = newSourcePos.distanceTo(newTargetPos);
                //var position = newTargetPos.clone().add(newSourcePos).divideScalar(2);
                //var orientation = new THREE.Matrix4();//a new orientation matrix to offset pivot
                //var offsetRotation = new THREE.Matrix4();//a matrix to fix pivot rotation
                //var offsetPosition = new THREE.Matrix4();//a matrix to fix pivot position
                //orientation.lookAt(newSourcePos, newTargetPos, new THREE.Vector3(0,1,0));
                //offsetRotation.makeRotationX(HALF_PI);//rotate 90 degs on X
                //orientation.multiply(offsetRotation);//combine orientation with rotation transformations
                //var cylinder = link.ui.geometry;//new THREE.CylinderGeometry(1.2,1.2,distance,1,1,false);
                ////cylinder.applyMatrix(orientation);
                //link.ui.scale.y = distance;
                //link.ui.geometry = cylinder;
                //link.ui.position.set(position.x, position.y, position.z);
                //console.log("After");
                //console.log(link.ui);
            });
        } else {
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
        }

        state.renderer.render(state.scene, state.camera);

    }

    function rebuildUI () {
        //Object.keys(nodeUI).forEach(function (nodeId) {
        //    scene.remove(nodeUI[nodeId]);
        //});
        //nodeUI = {};
        //
        //Object.keys(linkUI).forEach(function (linkId) {
        //    scene.remove(linkUI[linkId]);
        //});
        //linkUI = {};
        //
        //
        //network.get( 'nodes' ).forEach(function (n) {
        //    createNodeUI(n);
        //});
        //network.get( 'edges' ).forEach(function (e) {
        //    createLinkUI(e);
        //});

        // Remove old UI
        nodes.forEach(function (n) {
            var node = state.elements.elements['nl' + n.data.id];
            state.scene.remove(node.ui);
            node.ui = undefined;
        });
        edges.forEach(function (e) {
            var toID = e.data.target.substring(2);
            var fromID = e.data.source.substring(2);
            var link = state.elements.elements[ 'e' + fromID + toID ];
            state.scene.remove(link.ui);
            link.ui = undefined;
        });


        // Create new UI
        nodes.forEach(function (n) {
            createNodeUI(state.elements.elements['nl' + n.data.id]);
        });
        edges.forEach(function (e) {
            var toID = e.data.target.substring(2);
            var fromID = e.data.source.substring(2);
            var link = state.elements.elements[ 'e' + fromID + toID ];
            createLinkUI(link);
        });

    }

    /**
     * Check if the given Layout was already instantiated or is only a name.
     * If a name -> create new Layout
     * @param state
     * @returns {*}
     */

    function createLayout ( state ) {

        var input = state.layout;
        input = input === undefined ? 'ForceDirectedLayered' : input.name;

        network = state.elements;
        console.log(state);

        if ( typeof input === 'string' ) {

            var layout;

            if ( input === 'Fixed' ) {
                console.log(state.physicsSettings);
                return new Fixed( network, state );
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
        var renderer = webGlSupport ? new THREE.WebGLRenderer( { container: container, antialias: true } ) : new THREE.CanvasRenderer( container );

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
