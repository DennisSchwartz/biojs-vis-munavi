/*
 * biojs-vis-munavi
 * https://github.com/DennisSchwartz/biojs-vis-munavi
 *
 * Copyright (c) 2015 Dennis Schwartz
 * Licensed under the MIT license.
 */

// chai is an assertion library
var chai = require('chai');
var Utils = require('../lib/utils');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
chai.expect();
chai.should();

// requires your main app (specified in index.js)
var munavi = require('../');

describe('biojs-vis-munavi module', function(){
  describe('Utils', function () {
    var obj1, obj2;
    before(function () {
      obj1 = {
        elements: {
          layers: [
            {
              group: 'layers',
              data: {
                id: 'l1'
              }
            },
            {
              group: 'layers',
              data: {
                id: 'l2'
              }
            }
          ],
          nodes: [
            {
              group: "nodes",
              data: {
                id: 'n1'
              }
            },
            {
              group: "nodes",
              data: {
                id: 'n2'
              }
            }
          ]
        },
        style: "red",
        interactive: false
      };
      obj2 = {
        interactive: true,
        camera: {
          type: '',
          position: {
            x: 0,
            y: 0,
            z: 3000
          }
        }
      };
    });
    it('should merge options correctly', function () {
      console.log(Utils.merge(obj1, obj2));
    })
  })
});
