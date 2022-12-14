const { isPromise } = require('../utils')
const errors = require('./errors.js')

const cacheError = []
let cacheLength = 0
try {
  cacheLength = Number(process.env.ERROR_CACHE_LENGTH)
} catch {
  cacheLength = 3
}

const cache = () => cacheError
const setCacheLength = (length = 3) => { cacheLength = length }

function error (error, log = true) {
  const cl = typeof cacheLength === 'number' && cacheLength > 0 ? cacheLength : 3
  if (cacheError.unshift(error) > cl) cacheError.pop()
  console.log('------ Start handle error ------ ') // TODO: LogError
  console.log('Name: ', error.name)
  console.log('Code: ', error.code)
  console.log('Message: ', error.message)
  console.log('Stack: ', error.stack)
  console.log('------ End handle error ------ ')
  // throw error
}

function handle (fn, ...args) {
  if (typeof fn === 'function') {
    try {
      return fn(...args)
    } catch (err) {
      error(err)
    }
  } else if (isPromise(fn)) {
    return fn.catch(err => error(err))
  }
}

function handleAllException (active = true) {
  const fn = active ? err => error(err, true) : null
  process.setUncaughtExceptionCaptureCallback(fn)
}

function express (req, res, next) {
  try {
    next()
  } catch (err) {
    error(err)
  }
}

module.exports = {
  error,
  handle,
  handleAllException,
  express,
  errors,
  cache,
  setCacheLength
}
