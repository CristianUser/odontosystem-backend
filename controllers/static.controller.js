const mongoose = require('mongoose');
const _ = require('lodash');
var fs = require('fs');

const Static = mongoose.model('Static');


module.exports.add = (req, res, next) => {
    var static = new Static();
    Object.assign(static,req.body);
    static.save((err,data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    });
}

module.exports.getStatics = (req, res, next ) => {
    var test ;
     Static.find((err,data)=>{
        if (err) {
            return res.status(422).send({err: err});
        } else {
            let response={
                tests:[],
                historics:[]
            };
            data.forEach(obj =>{
                if (obj.category == 'test'){
                    response.tests.push(_.pick(obj,['id','name']))
                }else{
                    response.historics.push(_.pick(obj,['id','name']))
                }
                return response
            })
            return res.send(response);
        }
    });
}



