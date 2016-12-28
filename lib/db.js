"use strict";

const _ = require('lodash'),
  knex = require('knex'),
  Q = require('bluebird'),
  Thinodium = require('thinodium');

const Model = require('./model');



/**
 * Represents a db.
 */
class Knex extends Thinodium.Database {
  /**
   * Create a database connection.
   *
   * @param {Object} options connection options (as supported by Knex)
   *
   * @return {Promise} resolves to knex connection.
   */
  _connect (options) {
    return Q.resolve(knex(options));
  }


  _disconnect (connection) {
    return Q.promisify(connection.destroy, connection)();
  }


  _model (connection, name, config) {
    return new Model(connection, name, config);
  }

}


module.exports = Knex;
