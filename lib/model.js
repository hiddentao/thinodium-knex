"use strict";

const _ = require('lodash'),
  Q = require('bluebird'),
  Thinodium = require('thinodium');


class KnexModel extends Thinodium.Model {
  /**
   * Construct this model instance.
   *
   * @param  {Object} db  Knex instance.
   * @param  {String} name Table name.
   * @param  {Object} [cfg] Configuration
   * @param  {Object} [cfg.indexes] Indexes to setup.
   */
  constructor (db, name, cfg) {
    cfg = cfg || {};

    if (!cfg.pk) {
      cfg.pk = 'id';
    }

    super(db, name, cfg);
  }


  /**
   * @override
   */
  init () {
    return this.db.schema.hasTable(this.name)
      .then(function(exists) {
        if (!exists) {
          throw new Error(`Table ${this.name} not found!`);
        }
      });
  }


  /**
   * @override
   */
  rawQry () {
    const db = this.db;

    return db(this.name);
  }


  /**
   * @override
   */
  rawGet (id) {
    return Q.try(() => {
      if (undefined === id || null === id) {
        return null;
      }

      return this.rawQry().select().where(this._wherePk(id)).limit(1);
    });
  }

  /**
   * @override
   */
  rawGetAll () {
    return this.rawQry().select();
  }


  /**
   * @override
   */
  rawInsert (rawDoc) {
    return Q.try(() => {
      if (this.schema) {
        return this.schema.validate(rawDoc);
      }
    })
      .then(() => {
        return this.rawQry().insert(rawDoc).returning(this.pk);
      })
      .then((id) => {
        let newDoc = _.extend({}, rawDoc);

        if (!newDoc[this.pk] && ret.generated_keys) {
          newDoc[this.pk] = ret.generated_keys[0];
        }

        return newDoc;
      });
  }

  /**
   * @override
   */
  rawUpdate (id, changes) {
    return Q.try(() => {
      if (this.schema) {
        return this.schema.validate(changes, {
          ignoreMissing: true,
        });
      }
    })
      .then(() => {
        return this.rawQry().update(changes).where(this._wherePk(id));
      });
  }

  /**
   * @override
   */
  rawRemove (id) {
    return Q.resolve(
      this.rawQry().delete().where(this._wherePk(id));
    );
  }


  /**
   * Build where clause properties for: pk = ?
   */
  _wherePk (id) {
    const where = {};

    where[this.pk] = id;

    return where;
  }
};


module.exports = KnexModel;
