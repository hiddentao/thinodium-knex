"use strict";

require('co-mocha');

const _ = require('lodash'),
  chai = require('chai'),
  path = require('path'),
  sinon = require('sinon'),
  Q = require('bluebird'),
  knex = require('knex');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

exports.assert = chai.assert;
exports.expect = chai.expect;
exports.should = chai.should();

exports.sinon = sinon;

exports.Thinodium = require('thinodium');
exports.Plugin = require('../');



const testObjectMethods = {
  connect: function() {
    return Q.try(() => {
      this._knex = knex({
        client: 'pg',
        connection: 'postgres://thinodium:thinodium@127.0.0.1:5432/thinodium_knex',
        searchPaths: 'thinodium_knex',
        acquireConnectionTimeout: 1000,
        pool: { min: 0, max: 1 }
      })
    })
  },
  disconnect: function() {
    return this._knex.destroy()
    .then(() => {
      this._knex = null
    })
  },
  dropTables: function() {
    const tables = _.toArray(arguments);

    return Q.try(() => {
      if (this._knex) {
        return Q.reduce(tables, (m, t) => {
          return this._knex.schema.dropTableIfExists(t)
        }, 0)
      }
    })
  },
};



exports.createTest = function(_module) {
  var test = _module.exports = {};

  var testMethods = {};

  test[path.basename(_module.filename)] = {
    beforeEach: function*() {
      this.mocker = sinon.sandbox.create();

      _.each(testObjectMethods, (m, k) => {
        this[k] = _.bind(m, this);
      });

      yield this.connect();
    },
    afterEach: function*() {
      yield this.disconnect();

      this.mocker.restore();
    },
    'tests': testMethods
  };

  return testMethods;
};
