/*
 * biojs-vis-munavi
 * https://github.com/DennisSchwartz/biojs-vis-munavi
 *
 * Copyright (c) 2015 Dennis Schwartz
 * Licensed under the MIT license.
 */

// chai is an assertion library
var chai = require('chai');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
chai.expect();
chai.should();

// requires your main app (specified in index.js)
var munavi = require('../');

describe('biojs-vis-munavi module', function(){
  describe('#hello()', function(){
    it('should return a hello', function(){

      assert.equal(munavi.hello('biojs'), ("hello biojs"));
      
      // alternative styles
      munavi.hello('biojs').should.equal("hello biojs");
    });
  });
});
