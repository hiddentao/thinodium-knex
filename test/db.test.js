"use strict";

var _ = require('lodash'),
  Q = require('bluebird');

var utils = require('./utils'),
  assert = utils.assert,
  expect = utils.expect,
  should = utils.should,
  sinon = utils.sinon;

var Plugin = utils.Plugin,
  Database = Plugin.Database,
  Model = Plugin.Model;


var test = utils.createTest(module);



test['connection'] = {
  beforeEach: function*() {
    this.db = new Database();
  },

  afterEach: function*() {
    yield this.db.disconnect();
  },

  ok: function *() {
    yield this.db.connect({
      client: 'pg',
      connection: 'postgres://thinodium:thinodium@127.0.0.1:5432/thinodium_knex',
      searchPaths: 'thinodium_knex',
      acquireConnectionTimeout: 1000,
      pool: { min: 0, max: 1 }
    });
  },
};
