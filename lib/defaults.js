/**
 * Created by ds on 16/12/15.
 */

var THREE = require('three');

var defaults = {
    state: {
        elements: JSON.parse('{"elements":{"nA":{"group":"nodes","data":{"id":"nA","label":""}},"l1":{"group":"layers","data":{"id":"l1"}},"nlA1":{"group":"nodelayers","data":{"node":"A","layer":"1","id":"A1"}},"nB":{"group":"nodes","data":{"id":"nB","label":""}},"nlB1":{"group":"nodelayers","data":{"node":"B","layer":"1","id":"B1"}},"eA1B1":{"group":"edges","data":{"source":"nlA1","target":"nlB1","id":"nlA1nlB1","weight":0}},"nC":{"group":"nodes","data":{"id":"nC","label":""}},"nlC1":{"group":"nodelayers","data":{"node":"C","layer":"1","id":"C1"}},"eA1C1":{"group":"edges","data":{"source":"nlA1","target":"nlC1","id":"nlA1nlC1","weight":0}},"nD":{"group":"nodes","data":{"id":"nD","label":""}},"nlD1":{"group":"nodelayers","data":{"node":"D","layer":"1","id":"D1"}},"eA1D1":{"group":"edges","data":{"source":"nlA1","target":"nlD1","id":"nlA1nlD1","weight":0}},"nE":{"group":"nodes","data":{"id":"nE","label":""}},"nlE1":{"group":"nodelayers","data":{"node":"E","layer":"1","id":"E1"}},"eA1E1":{"group":"edges","data":{"source":"nlA1","target":"nlE1","id":"nlA1nlE1","weight":0}},"nF":{"group":"nodes","data":{"id":"nF","label":""}},"nlF1":{"group":"nodelayers","data":{"node":"F","layer":"1","id":"F1"}},"eA1F1":{"group":"edges","data":{"source":"nlA1","target":"nlF1","id":"nlA1nlF1","weight":0}},"eB1C1":{"group":"edges","data":{"source":"nlB1","target":"nlC1","id":"nlB1nlC1","weight":0}},"eB1D1":{"group":"edges","data":{"source":"nlB1","target":"nlD1","id":"nlB1nlD1","weight":0}},"eB1E1":{"group":"edges","data":{"source":"nlB1","target":"nlE1","id":"nlB1nlE1","weight":0}},"eB1F1":{"group":"edges","data":{"source":"nlB1","target":"nlF1","id":"nlB1nlF1","weight":0}},"eC1D1":{"group":"edges","data":{"source":"nlC1","target":"nlD1","id":"nlC1nlD1","weight":0}},"eC1E1":{"group":"edges","data":{"source":"nlC1","target":"nlE1","id":"nlC1nlE1","weight":0}},"eC1F1":{"group":"edges","data":{"source":"nlC1","target":"nlF1","id":"nlC1nlF1","weight":0}},"eD1E1":{"group":"edges","data":{"source":"nlD1","target":"nlE1","id":"nlD1nlE1","weight":0}},"eD1F1":{"group":"edges","data":{"source":"nlD1","target":"nlF1","id":"nlD1nlF1","weight":0}},"eE1F1":{"group":"edges","data":{"source":"nlE1","target":"nlF1","id":"nlE1nlF1","weight":0}},"l2":{"group":"layers","data":{"id":"l2"}},"nlA2":{"group":"nodelayers","data":{"node":"A","layer":"2","id":"A2"}},"nlB2":{"group":"nodelayers","data":{"node":"B","layer":"2","id":"B2"}},"eA2B2":{"group":"edges","data":{"source":"nlA2","target":"nlB2","id":"nlA2nlB2","weight":0}},"nlC2":{"group":"nodelayers","data":{"node":"C","layer":"2","id":"C2"}},"eA2C2":{"group":"edges","data":{"source":"nlA2","target":"nlC2","id":"nlA2nlC2","weight":0}},"nlD2":{"group":"nodelayers","data":{"node":"D","layer":"2","id":"D2"}},"eA2D2":{"group":"edges","data":{"source":"nlA2","target":"nlD2","id":"nlA2nlD2","weight":0}},"nlE2":{"group":"nodelayers","data":{"node":"E","layer":"2","id":"E2"}},"eA2E2":{"group":"edges","data":{"source":"nlA2","target":"nlE2","id":"nlA2nlE2","weight":0}},"nlF2":{"group":"nodelayers","data":{"node":"F","layer":"2","id":"F2"}},"eA2F2":{"group":"edges","data":{"source":"nlA2","target":"nlF2","id":"nlA2nlF2","weight":0}},"eB2C2":{"group":"edges","data":{"source":"nlB2","target":"nlC2","id":"nlB2nlC2","weight":0}},"eB2D2":{"group":"edges","data":{"source":"nlB2","target":"nlD2","id":"nlB2nlD2","weight":0}},"eB2E2":{"group":"edges","data":{"source":"nlB2","target":"nlE2","id":"nlB2nlE2","weight":0}},"eB2F2":{"group":"edges","data":{"source":"nlB2","target":"nlF2","id":"nlB2nlF2","weight":0}},"eC2D2":{"group":"edges","data":{"source":"nlC2","target":"nlD2","id":"nlC2nlD2","weight":0}},"eC2E2":{"group":"edges","data":{"source":"nlC2","target":"nlE2","id":"nlC2nlE2","weight":0}},"eC2F2":{"group":"edges","data":{"source":"nlC2","target":"nlF2","id":"nlC2nlF2","weight":0}},"eD2E2":{"group":"edges","data":{"source":"nlD2","target":"nlE2","id":"nlD2nlE2","weight":0}},"eD2F2":{"group":"edges","data":{"source":"nlD2","target":"nlF2","id":"nlD2nlF2","weight":0}},"eE2F2":{"group":"edges","data":{"source":"nlE2","target":"nlF2","id":"nlE2nlF2","weight":0}},"eA1A2":{"group":"edges","data":{"source":"nlA1","target":"nlA2","id":"nlA1nlA2","weight":0}},"eB1B2":{"group":"edges","data":{"source":"nlB1","target":"nlB2","id":"nlB1nlB2","weight":0}},"eC1C2":{"group":"edges","data":{"source":"nlC1","target":"nlC2","id":"nlC1nlC2","weight":0}},"eD1D2":{"group":"edges","data":{"source":"nlD1","target":"nlD2","id":"nlD1nlD2","weight":0}},"eE1E2":{"group":"edges","data":{"source":"nlE1","target":"nlE2","id":"nlE1nlE2","weight":0}},"eF1F2":{"group":"edges","data":{"source":"nlF1","target":"nlF2","id":"nlF1nlF2","weight":0}}},"nodes":[{"group":"nodes","data":{"id":"nA","label":""}},{"group":"nodes","data":{"id":"nB","label":""}},{"group":"nodes","data":{"id":"nC","label":""}},{"group":"nodes","data":{"id":"nD","label":""}},{"group":"nodes","data":{"id":"nE","label":""}},{"group":"nodes","data":{"id":"nF","label":""}}],"layers":[{"group":"layers","data":{"id":"l1"}},{"group":"layers","data":{"id":"l2"}}],"nodelayers":[{"group":"nodelayers","data":{"node":"A","layer":"1","id":"A1"}},{"group":"nodelayers","data":{"node":"B","layer":"1","id":"B1"}},{"group":"nodelayers","data":{"node":"C","layer":"1","id":"C1"}},{"group":"nodelayers","data":{"node":"D","layer":"1","id":"D1"}},{"group":"nodelayers","data":{"node":"E","layer":"1","id":"E1"}},{"group":"nodelayers","data":{"node":"F","layer":"1","id":"F1"}},{"group":"nodelayers","data":{"node":"A","layer":"2","id":"A2"}},{"group":"nodelayers","data":{"node":"B","layer":"2","id":"B2"}},{"group":"nodelayers","data":{"node":"C","layer":"2","id":"C2"}},{"group":"nodelayers","data":{"node":"D","layer":"2","id":"D2"}},{"group":"nodelayers","data":{"node":"E","layer":"2","id":"E2"}},{"group":"nodelayers","data":{"node":"F","layer":"2","id":"F2"}}],"edges":[{"group":"edges","data":{"source":"nlA1","target":"nlB1","id":"nlA1nlB1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlC1","id":"nlA1nlC1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlD1","id":"nlA1nlD1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlE1","id":"nlA1nlE1","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlF1","id":"nlA1nlF1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlC1","id":"nlB1nlC1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlD1","id":"nlB1nlD1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlE1","id":"nlB1nlE1","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlF1","id":"nlB1nlF1","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlD1","id":"nlC1nlD1","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlE1","id":"nlC1nlE1","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlF1","id":"nlC1nlF1","weight":0}},{"group":"edges","data":{"source":"nlD1","target":"nlE1","id":"nlD1nlE1","weight":0}},{"group":"edges","data":{"source":"nlD1","target":"nlF1","id":"nlD1nlF1","weight":0}},{"group":"edges","data":{"source":"nlE1","target":"nlF1","id":"nlE1nlF1","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlB2","id":"nlA2nlB2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlC2","id":"nlA2nlC2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlD2","id":"nlA2nlD2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlE2","id":"nlA2nlE2","weight":0}},{"group":"edges","data":{"source":"nlA2","target":"nlF2","id":"nlA2nlF2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlC2","id":"nlB2nlC2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlD2","id":"nlB2nlD2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlE2","id":"nlB2nlE2","weight":0}},{"group":"edges","data":{"source":"nlB2","target":"nlF2","id":"nlB2nlF2","weight":0}},{"group":"edges","data":{"source":"nlC2","target":"nlD2","id":"nlC2nlD2","weight":0}},{"group":"edges","data":{"source":"nlC2","target":"nlE2","id":"nlC2nlE2","weight":0}},{"group":"edges","data":{"source":"nlC2","target":"nlF2","id":"nlC2nlF2","weight":0}},{"group":"edges","data":{"source":"nlD2","target":"nlE2","id":"nlD2nlE2","weight":0}},{"group":"edges","data":{"source":"nlD2","target":"nlF2","id":"nlD2nlF2","weight":0}},{"group":"edges","data":{"source":"nlE2","target":"nlF2","id":"nlE2nlF2","weight":0}},{"group":"edges","data":{"source":"nlA1","target":"nlA2","id":"nlA1nlA2","weight":0}},{"group":"edges","data":{"source":"nlB1","target":"nlB2","id":"nlB1nlB2","weight":0}},{"group":"edges","data":{"source":"nlC1","target":"nlC2","id":"nlC1nlC2","weight":0}},{"group":"edges","data":{"source":"nlD1","target":"nlD2","id":"nlD1nlD2","weight":0}},{"group":"edges","data":{"source":"nlE1","target":"nlE2","id":"nlE1nlE2","weight":0}},{"group":"edges","data":{"source":"nlF1","target":"nlF2","id":"nlF1nlF2","weight":0}}]}'),
        style: {
            colorByLayer: true,
            colorByWeight: false,
            layerLabels: true,
            edgeColor: "#000000",
            backgroundColor: "#ffffff",
            colorKey: true
        },
        layout: { name: 'Circle' },
        directed: true,
        menuEnabled: true,
        interactive: true,
        camera: {
            type: '',
            position: {
                x: 88,
                y: -454,
                z: 181
            }
        },
        interLayerDistance: 100,
        nodesize: 12,
        normalisation: 'log',
        maxWeight: 0,
        physicsSettings: {
            springLength: 100,
            springCoeff: 0.0008,
            gravity: -1.0,
            theta: 0.8,
            dragCoeff: 0.02,
            timeStep : 10,
            stableThreshold: 0.009
        }
    },

    //orderOfElements: {
    //    layers: [
    //        'Transcriptionalregulation',
    //        'Post-transcriptionalregulation',
    //        'Post-translationalmodification',
    //        'Directedprotein-proteininteraction',
    //        'Pathwayregulation',
    //        'Interactionbetweenpathwaymembers',
    //        'interactionfromexternaldatabases'
    //    ]
    //},


    /**
     * This sets the default node rendering function
     */

    nodeRenderer: function ( node ) {
        node.ui.position.x = node.position.x;
        node.ui.position.y = node.position.y;
        node.ui.position.z = node.position.z;
    },
    /**
     * The default UI settings for nodes
     * @param node
     * @returns {THREE.Mesh}
     */

    nodeUIBuilder: function ( node ) {

        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        var geometry = new THREE.SphereGeometry(7);

        return new THREE.Mesh(geometry, material);

    },


    /**
     * The default UI settings for links
     * @param edge
     * @returns {THREE.Line}
     */

    linkUIBuilder: function ( edge ) {
        //

        // Create a free geometry
        var geometry = new THREE.Geometry();

        // Add two vertices
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geometry.faces.push( new THREE.Face3( 4, 5, 6 ) );
        geometry.faces.push( new THREE.Face3( 4, 6, 7 ) );
        geometry.faces[0].color.setRGB(0,0,0);
        var material = new THREE.MeshBasicMaterial( { color: 0xd5d5d5 } );
        material.side = THREE.DoubleSide;
        var ui = new THREE.Mesh( geometry, material );
        ui.myId = edge.data.id;
        return ui;


        //// Create a free geometry
        //var geometry = new THREE.Geometry();
        //
        //// Add two vertices
        //geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        //geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        //var material = new THREE.LineBasicMaterial( { color: 0xd9d9d9 } );
        //
        //return new THREE.Line( geometry, material );

        // edge from X to Y
        // var direction = new THREE.Vector3().subVectors( pointY, pointX );
        // var arrow = new THREE.ArrowHelper( direction, pointX );
        //
        // // cylinder: radiusAtTop, radiusAtBottom,
        // //     height, radiusSegments, heightSegments
        // var edgeGeometry = new THREE.CylinderGeometry( 2, 2, direction.length(), 6, 4 );
        //
        // var edge = new THREE.Mesh( edgeGeometry,
        //     new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
        // edge.rotation = arrow.rotation.clone();
        // edge.position = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5) );
        // return edge;
        //
        //var dir = new THREE.Vector3( 0, 0, 0 );
        //var origin = new THREE.Vector3( 0, 0, 0 );
        //var length = 1;
        //var hex = 0xffff00;
        //
        //var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        //
        //return arrowHelper;
        //var vstart = new THREE.Vector3( 0, 0, 0 );
        //var vend = new THREE.Vector3( 0, 0, 0 );
        //var HALF_PI = Math.PI * .5;
        //var distance = vstart.distanceTo(vend);
        //var position  = vend.clone().add(vstart).divideScalar(2);
        //
        //var material = new THREE.MeshLambertMaterial({color:0x0000ff});
        //var cylinder = new THREE.CylinderGeometry(10,10,distance,10,10,false);
        //
        //var orientation = new THREE.Matrix4();//a new orientation matrix to offset pivot
        //var offsetRotation = new THREE.Matrix4();//a matrix to fix pivot rotation
        //var offsetPosition = new THREE.Matrix4();//a matrix to fix pivot position
        //orientation.lookAt(vstart,vend,new THREE.Vector3(0,1,0));//look at destination
        //offsetRotation.makeRotationX(HALF_PI);//rotate 90 degs on X
        //orientation.multiply(offsetRotation);//combine orientation with rotation transformations
        //cylinder.applyMatrix(orientation);
        //
        //var mesh = new THREE.Mesh(cylinder,material);
        //mesh.position=position;
        //return mesh;
    },


    physicsSettings: {
        /**
         * Ideal length for links (springs in physical model).
         */
        springLength: 100,

        /**
         * Hook's law coefficient. 1 - solid spring.
         */
        springCoeff: 0.0008,

        /**
         * Coulomb's law coefficient. It's used to repel nodes thus should be negative
         * if you make it positive nodes start attract each other :).
         */
        gravity: -1.0,

        /**
         * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
         * The closer it's to 1 the more nodes algorithm will have to go through.
         * Setting it to one makes Barnes Hut simulation no different from
         * brute-force forces calculation (each node is considered).
         */
        theta: 0.8,

        /**
         * Drag force coefficient. Used to slow down system, thus should be less than 1.
         * The closer it is to 0 the less tight system will be.
         */
        dragCoeff: 0.02,

        /**
         * Default time step (dt) for forces integration
         */
        timeStep : 10,

        /**
         * Maximum movement of the system which can be considered as stabilized
         */
        stableThreshold: 0.009
    },

    nodeColors: [
        0x2ca02c, 0xf7b6d2,
        0xd62728, 0xff9896,
        0x1f77b4, 0xaec7e8,
        0xff7f0e, 0xffbb78,
        0x9467bd, 0xc5b0d5,
        0x8c564b, 0xc49c94,
        0xe377c2, 0x98df8a,
        0x7f7f7f, 0xc7c7c7,
        0xbcbd22, 0xdbdb8d,
        0x17becf, 0x9edae5
    ]

};

module.exports = defaults;
