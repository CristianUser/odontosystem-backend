const mongoose = require('mongoose');
const _ = require('lodash');
var fs = require('fs');

const Todo = mongoose.model('Todo');


module.exports.add = (req, res, next) => {
    var todoItem = new Todo();
    Object.assign(todoItem, req.body);
    todoItem.userId = req._id;
    todoItem.save((err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    });
}
module.exports.get = (req, res, next) => {
    Todo.find({userId: req._id}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}
module.exports.delete = (req, res, next) => {
    Todo.deleteOne({_id: req.body.id}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}

module.exports.changeStatus = (req, res, next) => {
    Todo.updateOne({_id: req.body.id}, {status: req.body.status}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}