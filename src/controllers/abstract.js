const { handle, thens } = require('../middleware/promises')
const H = require('../middleware/promises/simpleHandlers')
const { compareArray } = require('../utils')

const getData = (Model, req, res, thens = [], catches = []) => {
  return handle(
    Model.findOneBy(req.params),
    [H.checkData(res), ...thens],
    [...catches, H.statusErr(res)]
  )
}

const compareBody = (body, data) => {
  body = { id: data.id, ...body } // Primary key
  return [body, compareArray(Object.keys(body), Object.keys(data))]
}

function all (Model, req, res) {
  thens(Model.find(), H.checkData(res), H.simpleRes(res))
}

function get (Model, req, res) {
  getData(Model, req, res, [H.simpleRes(res)])
}

function post (Model, req, res) {
  if (!req.body) res.sendStatus(400)
  else {
    handle(Model.save(new Model(req.body)), [H.simpleRes(res)], [H.statusErr(res)])
  }
}

function put (Model, req, res) {
  const handler = data => {
    const [body, isEqualKeys] = compareBody(req.body, data)
    if (isEqualKeys) {
      handle(Model.save(body), [() => res.json(body)], [H.statusErr(res)])
    } else res.sendStatus(400)
  }
  getData(Model, req, res, [handler])
}

function patch (Model, req, res) {
  const handler = data => {
    req.body = compareBody(req.body, data)[0]
    handle(Model.save(req.body), [() => get(Model, req, res)], [H.statusErr(res)])
  }
  getData(Model, req, res, [handler])
}

function del (Model, req, res) {
  const handler = data => {
    handle(Model.remove(data), [() => res.sendStatus(204)], [H.statusErr(res)])
  }
  getData(Model, req, res, [handler])
}
Object.defineProperty(del, 'name', { value: 'delete' })

function init (targetModel = '', ...callbacks) {
  function created (model) {
    const data = {}
    callbacks.forEach(cb => {
      const name = Object.getOwnPropertyDescriptor(cb, 'name').value
      data[name] = (req, res) => {
        cb(model, req, res)
      }
    })
    return data
  }
  Object.defineProperty(created, 'name', { value: targetModel })
  return created
}

module.exports = {
  init,
  getData,
  compareBody,
  methods: { all, get, post, put, patch, delete: del }
}
