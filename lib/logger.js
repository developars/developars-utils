'use strict'

const bole = require('bole')

bole.output({
  level: 'info',
  stream: process.stdout
})

const log = bole('module')

function example () {
  log.debug('W00t!')
  log.info('Starting module#example')
}

example()
