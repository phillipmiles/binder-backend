// server/routes/index.js
const user = require('./user')
const workspace = require('./workspace')

module.exports = (router) => {
    user(router)
    workspace(router)
}