# Thinodium Knex adapter

[![Build Status](https://travis-ci.org/hiddentao/thinodium-knex.svg?branch=master)](http://travis-ci.org/hiddentao/thinodium-knex)
[![npm](https://img.shields.io/npm/v/thinodium.svg?maxAge=2592000)](https://www.npmjs.com/package/thinodium-knex)
[![Join the chat at https://discord.gg/bYt4tWB](https://img.shields.io/badge/discord-join%20chat-738bd7.svg?style=flat-square)](https://discord.gg/bYt4tWB)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/hiddentao)


A [Knex](http://knexjs.org/) adapter for [thinodium](https://github.com/hiddentao/thinodium), allowing
you to connect to relational database engines supported by Knex.

This adapter will NOT create tables, relations and indices for you. Instead we
recommend using Knex's built-in [seeding and migration](http://knexjs.org/#Migrations)
functionality to do that.

**WARNING: When inserting rows the `RETURNING` clause is used to fetch the id
of the inserted row - this is then set on the returned document. But this clause
[only works for Postgres, MSSQL and Oracle](http://knexjs.org/#Builder-returning).
For other database engines do not
rely on the id in the returned object, i.e. freshly fetch the inserted data
manually.**

## Installation

```bash
$ npm install thinodium thinodium-knex
```

## Usage examples

```js
const Thinodium = require('thinodium');

const db = yield Thinodium.connect('knex', {
  /* knex configuration options - see http://knexjs.org/#Installation-client */
});

// Get a builder for the "User" table. The table must already exist!
const User = yield db.model('User');

// insert a new user
let user = yield User.insert({
  name: 'john'
});

// ... normal thinodium API methods available at this point
```

Check out the [thinodium docs](https://hiddentao.github.io/thinodium) for further usage examples and API docs.

## Building

Install Postgres and create the test user (use `thinodium` as the password when prompted):

```bash
$ createuser -d -l -r -s -W thinodium
$ createdb thinodium_knex
```

On the command-line:

    $ npm install
    $ npm test

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/hiddentao/thinodium-knex/blob/master/CONTRIBUTING.md).

## License

MIT - see [LICENSE.md](https://github.com/hiddentao/thinodium-knex/blob/master/LICENSE.md)
