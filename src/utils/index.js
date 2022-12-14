const fs = require('node:fs')
const path = require('node:path')

function multiTestReg (value, RegExs = []) {
  return RegExs.filter(reg => RegExp(reg).test(value))
}

function readDir (pathDir, ignore = []) {
  const data = []
  if (!Array.isArray(ignore)) ignore = [ignore]
  fs.readdirSync(pathDir).forEach(value => {
    if (multiTestReg(value, ignore).length === 0) data.push(value)
  })
  return data
}

function removeExtFile (file) {
  return file.replace(path.extname(file), '')
}

// TODO: Ignore with paths not RegExs
function imports (pathDir, ignore = ['index.js'], dir = false, dirTree = true) {
  const dirData = readDir(pathDir, ignore)
  let data = []
  dirData.forEach(value => {
    const pathValue = path.join(pathDir, value)
    const stat = fs.statSync(pathValue)
    const item = {}
    if (stat.isFile()) {
      item.type = 'file'
      item.name = removeExtFile(value)
      item.file = value
      item.data = require(pathValue)
    } else if (stat.isDirectory() && dir) {
      const recursive = imports(pathValue, ignore, dir, dirTree)
      if (dirTree) {
        item.type = 'directory'
        item.name = value
        item.data = recursive
      } else data = [...data, ...recursive]
    }
    if (item) data.push(item)
  })
  return data
}

function capitalize (string = '') {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function createClass (propsDefined = {}, ...properties) {
  class classCreated {
    constructor (values) {
      properties.forEach((name, index) => {
        index = index.toString()
        if (!Array.isArray(values)) index = name
        this[name] = !!values && Object.getOwnPropertyNames(values).includes(index)
          ? values[index]
          : undefined
      })
    }
  }
  if (propsDefined.prototype !== undefined) delete propsDefined.prototype
  if (!propsDefined.name) propsDefined.name = { value: 'anonymous' }
  Object.defineProperties(classCreated, propsDefined)
  return classCreated
}

function checkBool (value = '') {
  return value === 'true' ? true : value === 'false' ? false : null
}

function isPromise (promise) {
  return promise && Object.prototype.toString.call(promise) === '[object Promise]'
}

function compareArray (obj, compare, sort = true) {
  if (!obj.length === compare.length) return false
  if (sort) {
    obj = obj.sort()
    compare = compare.sort()
  }
  return obj.every((value, index) => value === compare[index])
}

module.exports = {
  imports,
  readDir,
  capitalize,
  createClass,
  removeExtFile,
  multiTestReg,
  checkBool,
  isPromise,
  compareArray
}
