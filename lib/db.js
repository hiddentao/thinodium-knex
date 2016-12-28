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
    return Q.try(() => {
      const db = knex(options)

      // ensure connection actually works!
      return db.schema.hasTable('test')
        .catch((err) => {
          // destroy the connection pool straight away
          return db.destroy()
            .then(() => {
              throw err
            })
        })
        .then(() => db)
    })
  }


  _disconnect (connection) {
    return connection.destroy()
  }


  _model (connection, name, config) {
    return new Model(connection, name, config);
  }

}


module.exports = Knex;
