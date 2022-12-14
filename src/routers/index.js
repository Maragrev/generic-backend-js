const express = require('express')
const { imports, checkBool } = require('../utils')

function getRouter (...data) {
  const router = express.Router()
  data.forEach(args => {
    let prop = null
    if (Array.isArray(args)) {
      const isMethod = [typeof args[0], typeof args[1]].every(v => v === 'string')
      if (isMethod && typeof router[args[0]] !== 'undefined') prop = args.splice(0, 1)[0]
    } else if (typeof args === 'object') {
      const { method, path, handlers } = args
      prop = typeof router[method] !== 'undefined' ? method : null
      if (Array.isArray(handlers)) args = handlers
      else args = [handlers]
      if (path) args.unshift(path)
    }
    if (prop) router[prop](...args)
    else router.use(...args)
  })
  return router
}

let dir = checkBool(process.env.ROUTER_NAME_DIRECTORY)
dir = dir === null ? true : dir
let file = checkBool(process.env.ROUTER_NAME_FILE)
file = file === null ? true : file

function recursiveRouter (data = [], controllers) {
  const routers = express.Router()
  data.forEach(value => {
    let path = '/'
    let router = null
    if (value.type === 'directory') {
      // TODO: File for defined routers of paths directories
      if (dir) path += value.name
      router = recursiveRouter(value.data, controllers)
      routers.use(path, router)
    } else if (value.type === 'file') {
      if (typeof value.data === 'function') value.data = [value.data]
      Object.values(value.data).forEach(item => {
        if (typeof item === 'function') {
          const subData = item(controllers)
          if (file) path = `/${value.name}`
          router = null
          if (Array.isArray(subData)) router = getRouter(...subData)
          else if (typeof subData === 'object') {
            if (subData?.path) path = subData.path
            router = getRouter(...subData.handlers)
          }
          routers.use(path, router)
        }
      })
    }
  })
  return routers
}

function init (controllers) {
  const ignore = ['index.js', '\\w+\\.(?!js$)']
  return recursiveRouter(imports(__dirname, ignore, true), controllers)
}

module.exports = init
