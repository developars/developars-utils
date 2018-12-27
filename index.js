'use strict'

const terminate = require('./terminate')
const { getLogger, logHandler } = require('./lib/logger')

module.exports = {
  terminate,
  getLogger,
  logHandler
}
