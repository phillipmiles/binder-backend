/** server/controllers/article.ctrl.js*/
// const Article = require('./../models/Article')
const Node = require('./../models/Workspace')
const User = require('./../models/User')
const fs = require('fs')
// const cloudinary = require('cloudinary')

module.exports = {
    addNode: (req, res, next) => {
        // Expects req.body to contain title, doc_id and array of children node ids.
        console.log(req.body);
        // let { text, title } = req.body
        
        
        // Can't have duplicate doc_id!!!!!!


        new Node({
            title: req.body.title, 
            doc_id: req.body.doc_id
        }).save((err, node) => {
            if (err)
                res.sendStatus(err)
            else if (!node)
                res.sendStatus(400)
            else { 
            
                // node.addChild(req.body.children).then((_node) => {
                //     return res.send(_node)
                // })

                return res.send(node)
            }
                // return res.json({msg: "Done"})
                // return article.addAuthor(req.body.author_id).then((_article) => {
                //     return res.sendStatus(_article)
                // })
            
        })
    },
    getAll: (req, res, next) => {
        // Article.find(req.params.id)
        // .populate('author')
        // .populate('comments.author').exec((err, article)=> {
        //     if (err)
        //         res.sendStatus(err)
        //     else if (!article)
        //         res.sendStatus(404)
        //     else
        //         res.sendStatus(article)
        //     next()            
        // })

        Node.find(req.params.id)
        .populate('children').exec((err, node)=> {
            if (err)
                res.sendStatus(err)
            else if (!node)
                res.sendStatus(404)
            else
                res.sendStatus(node)
            // next()            
        })
    },
    addChild: (req, res, next) => {
        Node.findById(req.body.node_id).then((node)=> {
            return node.addChild(req.body.child_id).then(() => {
                return res.json({msg: "Done"})
            })
        }).catch(next)
    }
}