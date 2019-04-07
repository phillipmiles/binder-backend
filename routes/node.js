// server/routes/article.js
const nodecontroller = require('./../controllers/node.ctrl')
// const multipart = require('connect-multiparty')
// const multipartWare = multipart()

module.exports = (router) => {
    /**
     * get all articles
     */
    router
        .route('/nodes')
        .get(nodecontroller.getAll)

    // router.get('/', function(req, res) {
    //     res.render('index', {commentsTest: 'test'});
    // })
    /**
     * add an article
     */
    // app.post('/', function (req, res) {
    //     res.send('POST request to the homepage')
    //   })

    // app
    //     .route('/book')
    //     .post(function (req, res) {
    //         res.send('Add a book')
    //     })
    router
        .route('/node')
        .post(nodecontroller.addNode)

        // .post(multipartWare, nodecontroller.addNode)
        
    /**
     * clap on an article
     */
    router
        .route('/node/birth')
        .post(nodecontroller.addChild)
//     /**
//      * comment on an article
//      */
//     router
//         .route('/article/comment')
//         .post(articlecontroller.commentArticle)
//     /**
//      * get a particlular article to view
//      */
//     router
//         .route('/article/:id')
//         .get(articlecontroller.getArticle)
}