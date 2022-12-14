const resStatusErr = require('../../helpers/responseStatusErr.json')

const checkData = (res) => {
  return (data, next) => {
    let code = null
    if ([null, undefined].includes(data)) code = 404
    else if (!data) code = 201
    else next()
    if (code) res.sendStatus(code)
  }
}

const checkParams = (...params) => {
  return (data, next) => {
    if (params.every(value => !!value)) next()
  }
}

const simpleRes = (res) => {
  return (data, next) => {
    res.json(data)
    next()
  }
}

const simpleStatus = (res, status) => {
  return (value, next) => {
    res.sendStatus(status)
    next()
  }
}

const statusCatch = (res, status, error) => {
  return (err, next) => {
    if (err.name === error?.name && err.code === error?.code) {
      res.sendStatus(status)
    }
    next()
  }
}

const statusErr = (res, msg = true) => {
  return (err, next) => {
    const error = resStatusErr[err.name]
    const code = error[err.code]
    if (error && code) {
      if (msg) {
        if (typeof msg === 'string') msg = { error: msg }
        else if (msg === true) {
          msg = err.message.replace(new RegExp(`${err.code}[\\s|:]`, 'i'), '')
          msg = { error: msg.replace(/^\s+/, '') }
        }
        res.status(code).json(msg)
      } else res.sendStatus(error[err.code])
    }
    next()
  }
}

module.exports = {
  checkData,
  checkParams,
  simpleRes,
  simpleStatus,
  statusCatch,
  statusErr
}
