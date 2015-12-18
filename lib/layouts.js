/**
 * Created by ds on 18/12/15.
 */

/*
 * This is a modified version of multilayerlayout3d
 * https://github.com/DennisSchwartz/multilayerlayout3d
 *
 * This is a multilayer layout for ngraph.three (https://github.com/anvaka/ngraph.three).
 * It is adapted from ngraph.forcelayout3d (https://github.com/anvaka/ngraph.forcelayout3d).
 *
 * Copyright (c) 2015, Dennis Schwartz
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module Dependencies
 */

//module.exports = createLayout;
//module.exports.simulator = require('ngraph.physics.simulator');
var eventify = require('ngraph.events');
var Defaults = require('./defaults');
var Options = {
    interLayerDistance: 100
};

/*
 * Public Methods
 */

function createIndependentMultilayerLayout(graph, physicsSettings, options) {
    if (!graph) {
        throw new Error('Graph structure cannot be undefined');
    }

    // Update Options file according to input
    if (options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                Options[key] = options[key];
                console.log(key + ': ' + Options[key]);
            }
        }
    }

    /**
     * Create one simulator for each layer
     */
    var createSimulator = require('ngraph.physics.simulator');
    var physicsSimulators = [];
    for (var i=0;i<graph.get('layers').length;i++) {
        physicsSimulators[i] = createSimulator(physicsSettings);
    }


    var interLayerDistance = Options.interLayerDistance;
    var nodeBodies = typeof Object.create === 'function' ? Object.create(null) : {};
    var springs = {};

    /**
     * For each layer, create bodies from nodes add the bodies to the corresponding simulator
     */

    initLayers();
    listenToEvents();

    var api = {
        /**
         * Do one step of iterative layout calculation
         * Return true is the current layout is stable
         */
        step: function() {
            var stable = [];
            for (var i=0;i<physicsSimulators.length; i++) {
                stable.push(physicsSimulators[i].step());
            }
            // Check if all simulators are stable
            //console.log(stable);
            for (i=0;i<stable.length;i++) {
                if (!stable[i]) {
                    return false
                }
            }
            return true;
        },

        /**
         * This will return the current position for each node
         * @param nodeId
         * @returns {Vector3d}
         */
        getNodePosition: function (nodeId) {
            var layer = getLayer(nodeId);
            var body = getInitializedBody(nodeId);
            console.log("bOdy before pos.z: " + body.pos);
            body.pos.z = layer * interLayerDistance;
            return body.pos;
        },

        /**
         * Sets position of a node to a given coordinates
         * @param {string} nodeId node identifier
         * @param {number} x position of a node
         * @param {number} y position of a node
         * @param {number=} z position of node (only if applicable to body)
         */
        setNodePosition: function (nodeId) {
            var body = getInitializedBody(nodeId);
            body.setPosition.apply(body, Array.prototype.slice.call(arguments, 1));
        },

        /**
         * @returns {Object} Link position by link id
         * @returns {Object.from} {x, y} coordinates of link start
         * @returns {Object.to} {x, y} coordinates of link end
         */
        getLinkPosition: function (linkId) {
            var spring = springs[linkId];
            if (spring) {
                return {
                    from: spring.from.pos,
                    to: spring.to.pos
                };
            }
        },

        /**
         * @returns {Object} area required to fit in the graph. Object contains
         * `x1`, `y1` - top left coordinates
         * `x2`, `y2` - bottom right coordinates
         */
        getGraphRect: function () {
            var boxes = [];
            for (var i=0;i<physicsSimulators.length; i++) {
                boxes.push(physicsSimulators[i].getBBox());
            }
            var maxX1 = Math.max.apply(Math,boxes.map(function(o){return o.x1;}));
            var maxY1 = Math.max.apply(Math,boxes.map(function(o){return o.y1;}));
            var maxX2 = Math.max.apply(Math,boxes.map(function(o){return o.x2;}));
            var maxY2 = Math.max.apply(Math,boxes.map(function(o){return o.y2;}));
            return {x1: maxX1, y1: maxY1, x2: maxX2, y2: maxY2, z1: 0, z2: graph.get('layers').length * interLayerDistance + 15};
        },

        getGraphWidth: function () {
            var boxes = [];
            var box;
            var max = 0;
            var t;
            for (var i=0;i<physicsSimulators.length; i++) {
                box = physicsSimulators[i].getBBox();
                t = Math.max(Math.abs(box.x1 - box.x2), Math.abs(box.y1 - box.y2));
                if (t > max) max = t;
            }
            return max;
        },

        /*
         * Requests layout algorithm to pin/unpin node to its current position
         * Pinned nodes should not be affected by layout algorithm and always
         * remain at their position
         */
        pinNode: function (node, isPinned) {
            var body = getInitializedBody(node.id);
            body.isPinned = !!isPinned;
        },

        /**
         * Checks whether given graph's node is currently pinned
         */
        isNodePinned: function (node) {
            return getInitializedBody(node.id).isPinned;
        },

        /**
         * Request to release all resources
         */
        dispose: function() {
            //graph.off('changed', onGraphChanged);
            for (var i=0;i<physicsSimulators.length; i++) {
                physicsSimulators[i].off('stable', onStableChanged);
            }
        },

        /**
         * Sets the inter layer distance
         */
        setInterLayerDistance: function (dist) {
            interLayerDistance = dist;
        },

        /**
         * Gets physical body for a given node id. If node is not found undefined
         * value is returned.
         */
        getBody: getBody,

        /**
         * Gets spring for a given edge.
         *
         * @param {string} linkId link identifer. If two arguments are passed then
         * this argument is treated as formNodeId
         * @param {string=} toId when defined this parameter denotes head of the link
         * and first argument is trated as tail of the link (fromId)
         */
        getSpring: getSpring,

        /**
         * [Read only] Gets current physics simulator
         */
        simulator: {},

        /**
         * Update physics settings
         */
        updatePhysics: updatePhysics,

        makeStable: function () {
            onStableChanged(true);
        }


    };

    eventify(api);
    return api;

    function listenToEvents() {
        graph.on('changed', onGraphChanged);
        for (var i=0;i<physicsSimulators.length;i++) {
            physicsSimulators[i].on('stable', onStableChanged);
        }
        //physicsSimulators[0].on('stable', onStableChanged);
    }

    function onStableChanged(isStable) {
        console.log('Stable has changed!');
        api.fire('stable', isStable);
    }

    function onGraphChanged(changes) {
        for (var i = 0; i < changes.length; ++i) {
            var change = changes[i];
            if (change.changeType === 'add') {
                if (change.node) {
                    initBody(change.node.id);
                }
                if (change.link) {
                    initLink(change.link);
                }
            } else if (change.changeType === 'remove') {
                if (change.node) {
                    releaseNode(change.node);
                }
                if (change.link) {
                    releaseLink(change.link);
                }
            }
        }
    }


    function getSpring(fromId, toId) {
        var linkId;
        if (toId === undefined) {
            if (typeof fromId !== 'object') {
                // assume fromId as a linkId:
                linkId = fromId;
            } else {
                // assume fromId to be a link object:
                linkId = fromId.id;
            }
        } else {
            // toId is defined, should grab link:
            var link = graph.get('edges').get(fromId + '-' + toId);
            if (!link) return;
            linkId = link.id;
        }
        console.log("Hello I'm here as well!");

        return springs[linkId];
    }

    function getLayer(nodeId) {
        var node = graph.get('nodes').get(nodeId);
        return graph.get('layers').indexOf(graph.get('layers').get(node.get('layer').get('id'))); // Return the index of the layer of node
    }

    function initLayers() {
        graph.get('nodes').forEach(function (node) {
            var layer = getLayer(node.id);
            initBody(node.id, layer);
        });
        graph.get('edges').forEach(initLink);
    }

    function initBody(nodeId, layer) {
        var body = nodeBodies[nodeId];
        if (!body) {
            var node = graph.get('nodes').get(nodeId);
            if (!node) {
                throw new Error('initBody() was called with unknown node id');
            }
        }

        var pos = node.position;
        if (!pos) {
            var neighbors = getNeighborBodies(node);
            pos = physicsSimulators[layer].getBestNewBodyPosition(neighbors);
        }

        body = physicsSimulators[layer].addBodyAt(pos);

        nodeBodies[nodeId] = body;
        updateBodyMass(nodeId);
        //
        //
        //if (isNodeOriginallyPinned(node)) {
        //    body.isPinned = true;
        //}

        //TODO: Does this work??
    }

    function getBody(nodeId) {
        return nodeBodies[nodeId];
    }

    function releaseNode(node) {
        var nodeId = node.id;
        var body = nodeBodies[nodeId];
        if (body) {
            nodeBodies[nodeId] = null;
            delete nodeBodies[nodeId];

            physicsSimulator.removeBody(body); //TODO: update for multilayer layout
        }
    }

    function initLink(link) {
        updateBodyMass(link.get('source'));
        updateBodyMass(link.get('target'));


        // Only add springs for intra-layer links
        var layer = graph.get('nodes').get(link.get('source')).get('layer').get('id'); // One node is enough to get layer
        var layerindex = getLayer(link.get('target'));
        if (checkLinkLayer(graph.get('nodes').get(link.get('source')), graph.get('nodes').get(link.get('target')), layer)) {
            var fromBody = nodeBodies[link.get('source')],
                toBody  = nodeBodies[link.get('target')],
                spring = physicsSimulators[layerindex].addSpring(fromBody, toBody);
            noop(link, spring);
            springs[link.id] = spring;
        }
    }

    function releaseLink(link) {
        var spring = springs[link.get('id')];
        if (spring) {
            var from = graph.get('nodes').get(link.fromId),
                to = graph.get('nodes').get(link.toId);

            if (from) updateBodyMass(from.get('id'));
            if (to) updateBodyMass(to.get('id'));

            delete springs[link.get('id')];

            physicsSimulator.removeSpring(spring);
        }
    }


    /**
     * Checks whether graph node has in its settings pinned attribute,
     * which means layout algorithm cannot move it. Node can be preconfigured
     * as pinned, if it has "isPinned" attribute, or when node.data has it.
     *
     * @param {Object} node a graph node to check
     * @return {Boolean} true if node should be treated as pinned; false otherwise.
     */
    //function isNodeOriginallyPinned(node) {
    //    return (node && (node.isPinned || (node.data && node.data.isPinned)));
    //}
    //
    function getInitializedBody(nodeId) {
        var body = nodeBodies[nodeId];
        if (!body) {
            initBody(nodeId);
            body = nodeBodies[nodeId];
        }
        return body;
    }

    function getNeighborBodies(node, layer) {
        // set maxNeighbors to min of 2 or number of intra-layer(!) links
        var neighbors = [];
        if (!node.links) {
            return neighbors;
        }
        var sameLayerLinks = getSameLayerLinks(node,layer);
        var maxNeighbors = Math.min(sameLayerLinks.length, 2);
        for (var i=0;i<maxNeighbors; i++) {
            var link = sameLayerLinks[i];
            var otherBody = link.get('source') !== node.get('id') ? nodeBodies[link.get('source')] : nodeBodies[link.get('target')];
            if (otherBody && otherBody.pos) {
                neighbors.push(otherBody);
            }
        }

        return neighbors;
    }

    function getSameLayerLinks(node, layer) {
        var res = [];
        var n1, n2;
        for (var i=0;i<node.links.length;i++) {
            n1 = graph.get('nodes').get(node.links[i].get('target'));
            n2 = graph.getNode(node.links[i].get('source'));
            if (checkLinkLayer(n1, n2, layer) ) {
                res[i] = node.links[i];
            }
        }
        return res;
    }

    function checkLinkLayer(node1, node2, layer) {
        return node1.get('layer').get('id') == layer && node2.get('layer').get('id') == layer;
    }

    function updateBodyMass(nodeId) {
        var body = nodeBodies[nodeId];
        body.mass = nodeMass(nodeId);
    }

    /**
     * Calculates mass of a body, which corresponds to node with given id.
     *
     * @param {String|Number} nodeId identifier of a node, for which body mass needs to be calculated
     * @returns {Number} recommended mass of the body;
     */
    function nodeMass(nodeId) {
        var links = graph.get('edges').byNode(graph.get('nodes').get(nodeId));
        if (!links) return 1;
        return 1 + links.length / 4.0;
    }


    function updatePhysics(settings) {
        for (key in settings) {
            if (settings.hasOwnProperty(key)) {
                for (var i = 0; i < physicsSimulators.length; i++) {
                    if (physicsSimulators[i][key]) {
                        physicsSimulators[i][key](settings[key]);
                    }
                }
            }
        }
        for (i = 0; i < physicsSimulators.length; i++) {
            physicsSimulators[i].fire('stable', false);
            physicsSimulators[i].step();
        }
    }

}

/**
 * Private Methods
 */
function  noop() { }

var _ = require('lodash');

function createConnectedMultilayerLayout(network, settings) {

    var createSimulator = require('ngraph.physics.simulator');
    var physicsSimulator = createSimulator(settings);

    var bodies = typeof Object.create === 'function' ? Object.create(null) : {};
    var springs = {};
    var positions = {};

    var interLayerDistance = 120;

    var V = network.get('V');
    var edges = network.get('edges');
    var nodes = network.get('nodes');
    var elements = network.get('elements');

    // Aggregate network

    var aggEdges = [];
    for ( var i=0; i < V.length; i++ ) {
        initBody(V[i]);
    }
    //V.each(function (v) {
    //    // Give simulated nodes to physics simulator
    //    initBody(v);
    //});

    ////V.each(function (v) {
    //for ( i=0; i < V.length; i++) {
    //    // Get all edges from current v
    //    var current = edges.byV(v.get('id'), network);
    //    // create edges if not existing yet
    //    current.each(function (e) {
    //        var from = network.get('nodes').get(e.get('source')).get('node').get('id');
    //        var to = network.get('nodes').get(e.get('target')).get('node').get('id');
    //        var edge = {
    //            id: from + '-' + to,
    //            from: from,
    //            to: to
    //        };
    //        if (!_.includes(_.pluck(aggEdges, 'id'), edge.id) && to !== from) {
    //            aggEdges.push(edge);
    //            initLink(edge);
    //        }
    //    })
    //}


    // Get all edges from v
    // create edges for aggregated network
    //var getGrp = function (grp, network) {
    //    return Object.keys(network).filter(function (el) {
    //        return network[el].group === grp;
    //    })
    //};
    //console.log(elements);
    //
    //for ( i=0; i < V.length; i++ ) {
    //    // Get all edges from this V that are not part of the aggregate elements yet
    //    var currentEdges = R.filter(function (e) {
    //        // Is it in the agg elements yet?
    //        var inAgg = !R.contains(e.id, R.pluck('id', aggEdges));
    //        //console.log("Test: " + JSON.stringify(elements['n' + elements[e.data.source].data['node']].data['id']) + ", " + JSON.stringify(V[i].data['id']));
    //        var nodeInSource = elements['n' + elements[e.data.source].data['node']].data['id'];
    //        var nodeInTarget = elements['n' + elements[e.data.target].data['node']].data['id'];
    //        return nodeInSource === V[i].data['id'] && inAgg && nodeInSource !== nodeInTarget;
    //    }, edges);
    //    for ( var j=0; j < currentEdges.length; j++ ) {
    //        var edge = currentEdges[j];
    //        var from = elements['n' + elements[edge.data.source].data['node']].data['id'];
    //        var to =  elements['n' + elements[edge.data.target].data['node']].data['id'];
    //        var newEdge = {
    //            id: from + '-' + to,
    //            from: from,
    //            to: to
    //        };
    //        aggEdges.push(newEdge);
    //        initLink(newEdge);
    //    }
    //}

    // Iterate edges
    // Create new edge from nodes (V) if it does not exist

    var agg2 = {};
    edges.forEach(function (edge) {
        var sourceNodeLayer = elements[edge.data['source']];
        var targetNodeLayer = elements[edge.data['target']];
        var sourceNode = elements['n' + sourceNodeLayer.data['node']].data['id'];
        var targetNode = elements['n' + targetNodeLayer.data['node']].data['id'];
        var aggEdgeID = sourceNode + '-' + targetNode;
        var newEdge = {
            id: sourceNode + '-' + targetNode,
            from: sourceNode,
            to: targetNode
        };
        if ( !agg2.hasOwnProperty(aggEdgeID) ) {
            agg2[aggEdgeID] = edge;
            initLink(newEdge);
        }
    });



    // Go through node-layers and add positions
    //network.get('nodes').each(function (n) {
    //    var id = n.get('node').get('id');
    //    var pos = bodies[id].pos;
    //    var z = network.get('layers').indexOf(n.get('layer')) * interLayerDistance;
    //    positions[id] = { pos: pos, z: z };
    //});
    //for ( i=0; i < nodes.length; i++ ) {
    //    var id = 'n' + nodes[i].data['node'];
    //    var pos = bodies[id].pos;
    //    var layers = R.map(function (i) { return i.data['id'] }, network.layers);
    //    console.log(layers);
    //    console.log(nodes[i].data['layer']);
    //    console.log(layers.indexOf('l' + nodes[i].data['layer']));
    //    var z = layers.indexOf('l' + nodes[i].data['layer']) * interLayerDistance;
    //    positions[id] = { pos: pos, z: z };
    //}


    initEvents();

    var api = {

        step: function () {
            return physicsSimulator.step();
        },

        getPositions: function () {
            return positions;
        },

        getNodePosition: function (node) {
            var id = 'n' + node.data['node'];
            return bodies[id].pos;
        },

        setInterLayerDistance: function ( dist ) {
            this.interLayerDistance = dist;
        },

        updatePhysics: updatePhysics,

        resetStable: function () {
            physicsSimulator.fire('stable', false);
            physicsSimulator.step();
        }


    };

    eventify(api);

    return api;


    function initEvents() {
        physicsSimulator.on('stable', function ( stable ) {
            console.log( 'PS fired stable! ' + stable );
            api.fire( 'stable', stable );
        });
    }

    // After each step, transfer positions??

    function initBody(node) {
        var id = node.data['id'];//get('id');
        var body = bodies[id];
        if (!body) {
            var neighbors = getNeighborBodies(node);
            var position = physicsSimulator.getBestNewBodyPosition(neighbors);
            body = physicsSimulator.addBodyAt(position);
            bodies[id] = body;
            updateBodyMass(id);
        }
    }

    function initLink(edge) {
        var spring = springs[edge.id];
        if (!spring) {
            updateBodyMass(edge.from);
            updateBodyMass(edge.to);
            spring = physicsSimulator.addSpring(bodies[edge.from], bodies[edge.to]);
            springs[edge.id] = spring;
        }
    }

    function getNeighborBodies(node) {
        var id = node.id;//get('id');
        var neighbors = [];
        // Go through links of node
        // Get aggEdges with node.id in to or from
        var links = _.filter(aggEdges, function (e) {
            return e.to === id || e.from === id;
        });
        var maxN = Math.min(links.length, 2);
        for (var i=0;i<maxN;i++) {
            var link = links[i];
            var otherBody = link.from !== id ? bodies[link.from] : bodies[link.to];
            neighbors.push(otherBody);
        }

        return neighbors;
    }


    function updateBodyMass(nodeId) {
        var body = bodies[nodeId];
        body.mass = nodeMass(nodeId);
    }

    /**
     * Calculates mass of a body, which corresponds to node with given id.
     *
     * @param {String|Number} nodeId identifier of a node, for which body mass needs to be calculated
     * @returns {Number} recommended mass of the body;
     */
    function nodeMass(nodeId) {
        var links = Object.keys(network).filter(function (el) {
            return el !== "get" && network[el].group === 'edges' && (network[el].data.source === nodeId || network[el].data.target === nodeId);
        });
        //var links = network.get('edges').byNode(network.get('nodes').get(nodeId));
        if (!links) return 1;
        return 1 + links.length / 4.0;
    }

    function updatePhysics( settings ) {
        for (var key in settings) {
            if (settings.hasOwnProperty(key)) {
                physicsSimulator.settings[key] = settings[key];
            }
        }
        physicsSimulator.fire('stable', false);
        physicsSimulator.step();
    }

}

function createManualLayout( network, settings ) {

    var elements = network.elements;
    // Set dummy position for each element for testing

    var max = 150;
    var min = -150;
    network.nodelayers.forEach(function (nl) {
        nl.pos = {};
        nl.pos.x = Math.floor(Math.random() * (max - min + 1)) + min;
        nl.pos.y = Math.floor(Math.random() * (max - min + 1)) + min;
        nl.pos.z = Math.floor(Math.random() * (max - min + 1)) + min;
    });


    return {
        step: function () {
            return true;
        },
        getNodePosition: function (node) {
            //console.log("Hallo!" + JSON.stringify(node));
            var id = 'nl' + node.data['node'];
            //console.log(elements[id]);
            return node.pos;//network.nodelayers[id].position;
        },
        nodeUIBuilder: Defaults.nodeUIBuilder,
        linkUIBuilder: Defaults.linkUIBuilder,
        nodeRenderer: Defaults.nodeRenderer,
        linkRenderer: Defaults.linkRenderer,
        setInterLayerDistance: noop,
        updatePhysics: noop,
        resetStable: noop

    };
}

var exports = {};
exports.independentMultilayer = createIndependentMultilayerLayout;
exports.connectedMultilayer = createConnectedMultilayerLayout;
exports.manual = createManualLayout;
module.exports = exports;
