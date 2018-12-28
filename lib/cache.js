'use strict'

const LRU = require('lru-cache')

// - max: The maximum size of the cache, checked
// by applying the length function to all values in the cache
// - maxAge Maximum age in ms. Items are not pro-actively pruned
// out as they age, but if you try to get an item that is too old,
// it'll drop it and return undefined instead of giving it to you
const options = {
  max: 100,
  maxAge: 1000 * 60 * 60 // 1 hour
}
// A cache object that deletes the least-recently-used items.
const cache = new LRU(options)

module.exports = cache
