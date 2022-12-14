const error = require('../../helpers').Error.error

function setHandlers (...handlers) {
  return value => {
    for (const i in handlers) {
      let toNext = false
      let next = null
      if (Number(i) === handlers.length - 1) next = () => {}
      else next = () => { toNext = true }
      try {
        handlers[i](...[value, next])
      } catch (err) {
        error(err)
      }
      if (!toNext) break
    }
    return value
  }
}

function Thens (promise, ...handlers) {
  return promise.then(setHandlers(...handlers))
}

function Catches (promise, ...handlers) {
  return promise.catch(setHandlers(...handlers))
}

function handle (promise, thens = [], catches = []) {
  if (thens) Thens(promise, ...thens)
  if (catches) Catches(promise, ...catches)
  promise.catch(err => {
    error(err)
  })
  return promise
}

module.exports = { handle, thens: Thens, catches: Catches, setHandlers }
