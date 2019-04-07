// server/routes/index.js
const user = require('./user')
// const node = require('./node')
const workspace = require('./workspace')

module.exports = (router) => {
    user(router)
    // node(router)
    
    workspace(router)

    // router.get('/', function(req, res) {
    //     res.render('index', {commentsTest: 'test'});
    // })

    // router
    //     .route('/')
    //     .get(articlecontroller.getAll)
}


