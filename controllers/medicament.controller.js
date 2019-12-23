const mongoose = require('mongoose');
const _ = require('lodash');
var fs = require('fs');

const Medicament = mongoose.model('Medicament');


module.exports.add = (req, res, next) => {
    var medicament = new Medicament();
    Object.assign(medicament,req.body);
    medicament.save((err,data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    });
}

module.exports.getMedicaments = (req, res, next) => {
    Medicament.find({status: 'active'}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}

module.exports.updateMedicament = (req, res, next) => {
    var medicament = new Medicament();
    Object.assign(medicament,req.body);
    // medicament.professionalId = req._id;
    medicament._id=req.body.id;
    delete medicament.id;
    Medicament.replaceOne({_id: req.body.id},medicament,//{ upsert: true },
        (err,data)=>{
            if (err){
                return res.status(442).send(err);
            }else{
                return res.status(200).send(data);
            }
    });
}

module.exports.getMedicament = (req, res, next) => {
    Medicament.find({_id: req.body._id}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}

module.exports.delete = (req, res, next) => {
    Medicament.updateOne({_id: req.body.id}, {status: 'disabled'}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}

module.exports.changeStatus = (req, res, next) => {
    Medicament.updateOne({_id: req.body.id}, {status: req.body.status}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}


