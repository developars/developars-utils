'use strict'

const path = require('path')
const uuid = require('uuid')
const bole = require('bole')
const chalk = require('chalk')
const streamFile = require('stream-file-archive')
const through = require('through2')
const morgan = require('morgan')
const { pkg } = require('@developars/config')

// -- Setup bole
// 'Bole': Log JSON from within Node.js applications

const levels = {
  info: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  debug: chalk.magenta
}

const rotator = streamFile({
  // We use 'rotator' in production mode, it let us to logg into a file
  path: `logs/${pkg.name}-${pkg.version}-%&-%m-%d.log`,
  symlink: 'logs/current.log',
  compress: true
})

const formatter = through((chunk, enc, callback) => {
  // @chunk is coming from output module.
  // e.g: {"time":"2018-12-27T08:00:27.351Z","hostname":"mbpro.local","pid":27070,"level":"info","name":"module","message":"Starting module#example"}
  try {
    // througn2: A tiny wrapper around Node.js streams.Transform (Streams2/3)
    // to avoid explicit subclassing noise
    // We use 'formatter' to log in development mode into console
    // Thanks through, we can modify the output colors
    let { id, level, name, message } = JSON.parse(chunk)
    const color = levels[level]

    id = id ? ` ${chalk.blue}` : ' '
    message = typeof message === 'object' ? JSON.stringyfy(message, null, 2) : message

    console.log(`${color(level)}${id}(${chalk.cyan(name)}) ${message}`)
    callback(null, chunk)
  } catch (err) {
    callback(err)
  }
})

bole.output({
  level: process.env.DEBUG ? 'debug' : 'info',
  stream: process.env.NODE_ENV === 'production' ? rotator : formatter
})

function getLogger (...names) {
  // The path.basename() methods returns the last portion of a path,
  // similar to the Unix basename command.
  // Trailing directory separators are ignored
  // e.g: path.basename('/foo/bar/baz/asdf/quux.html', '.html');
  // Returns: 'quux'
  const name = names.map(name => {
    return path.basename(name, '.js')
    // Provides the platform-specific path segment separator:
    // \ on Windows
    // / on POSIX
  }).join(path.sep)

  return bole(name)
}

// -- Setup Morgan
const log = getLogger(__dirname, __filename)

function middleware (tokens, req, res) {
  const id = req.id
  const { method, url, status } = tokens
  const message = `${method(req, res)} ${url(req, res)} ${status(req, res)} - ${tokens['response-time'](req, res)} ms`

  log.info({ id, message })
  return null
}

const customMorgan = morgan(middleware)

const logHandler = (req, res, next) => {
  req.id = uuid.v4()
  customMorgan(req, res, next)
}

module.exports = {
  getLogger,
  logHandler
}
