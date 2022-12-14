const { imports } = require('../utils')

function getControllers (data, models) {
  let controllers = {}
  const keysModels = Object.keys(models)
  Object.values(data).forEach(value => {
    if (typeof value === 'object') {
      controllers = { ...controllers, ...getControllers(value, models) }
    } else if (typeof value === 'function') {
      const name = Object.getOwnPropertyDescriptor(value, 'name').value
      if (keysModels.includes(name)) {
        controllers[name] = value(models[name])
      }
    }
  })
  return controllers
}

function init (models) {
  const ignore = ['abstract.js', 'index.js']
  return getControllers(imports(__dirname, ignore, true, false).map(v => v.data), models)
}

module.exports = init
