'use strict'

const { database } = require('dreamjob-db')({
  client: process.env.engine || 'mysql',
  host: process.env.host || '127.0.0.1',
  user: process.env.user || 'root',
  password: process.env.password || 'password',
  database: process.env.database || 'dreamjob_db'
})

module.exports = database
