const { init, methods } = require('./abstract')

const User = init('User', ...Object.values(methods))

module.exports = User
