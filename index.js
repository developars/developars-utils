'use strict'

const terminate = require('./lib/`terminate')
const cache = require('./lib/cache')
const { getLogger, logHandler } = require('./lib/logger')

module.exports = {
  terminate,
  cache,
  getLogger,
  logHandler
}
