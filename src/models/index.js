const { EntitySchema, BaseEntity } = require('typeorm')
const { imports, createClass } = require('../utils')

const models = {}
const schemas = {}
const prop = Object.getOwnPropertyDescriptors(BaseEntity)

class ModelError extends Error {}

// TODO: create models with standard object class
imports(__dirname, ['\\w+\\.(?!json$)'], true, false).forEach(value => {
  const file = value?.file || value.name
  if (!value.data.name) throw new ModelError(`Not set attribute name in model: ${file}`)
  if (!value.data.columns) throw new ModelError(`Not set columns in model: ${file}`)
  const name = value.data.name
  if (models[name] && schemas[name]) throw new ModelError(`Duplicate name model: ${name} from ${file}`)
  prop.name = { value: name }
  models[name] = createClass(prop, ...Object.keys(value.data.columns))
  value.data.target = models[name]
  schemas[name] = new EntitySchema(value.data)
})

module.exports = { models, schemas }
