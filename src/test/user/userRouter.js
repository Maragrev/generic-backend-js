function middlewareCreateUser (req, res, next) {
  console.log(`The user named will be created: ${req.body.name}`)
  next()
}

// function User ({ User }) {
//   return {
//     path: '/user', // /user/:username
//     handlers: [
//       {
//         method: 'get',
//         path: '/',
//         handlers: [User.all]
//       },
//       {
//         method: 'get',
//         path: '/:username',
//         handlers: User.get
//       },
//       {
//         method: 'post',
//         path: '/:username',
//         handlers: [middlewareCreateUser, User.post]
//       }
//     ]
//   }
// }

// Note: without property 'path' it take default name this file '<host>/userRouter/:username'

// function User2 ({ User }) {
//   return [
//     {
//       method: 'get',
//       path: '/',
//       handlers: [User.all]
//     },
//     {
//       method: 'get',
//       path: '/:username',
//       handlers: User.get
//     },
//     {
//       method: 'post',
//       path: '/:username',
//       handlers: [middlewareCreateUser, User.post]
//     }
//   ]
// }

// function User3 ({ User }) {
//   return [
//     ['/', User.all],
//     ['get', '/:username', User.get],
//     ['post', '/', User.post],
//     ['put', '/:username', User.put],
//     ['patch', '/:username', User.patch],
//     ['delete', '/:username', User.delete]
//   ]
// }

function User ({ User }) {
  return {
    path: '/user',
    handlers: [
      ['get', '/', User.all],
      ['get', '/:username', User.get],
      ['post', '/', middlewareCreateUser, User.post],
      ['put', '/:username', User.put],
      ['patch', '/:username', User.patch],
      ['delete', '/:username', User.delete]
    ]
  }
}

module.exports = User
