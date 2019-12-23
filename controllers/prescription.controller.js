const mongoose = require('mongoose');
const _ = require('lodash');
var fs = require('fs');

const Prescription = mongoose.model('Prescription');


module.exports.addPrescription = (req, res, next) => {
    var prescription = new Prescription();
    Object.assign(prescription,req.body);
    prescription.professionalId = ( req.userType == 'secretary')? '' : req._id;
    prescription.save().then(data => {
            return res.send(data)
        }).catch((err)=>{ 
        return res.status(442).send(err)
    });
}

module.exports.getPrescriptions = (req, res, next ) => {
    Prescription.find({...( req.userType == 'secretary')? {} : {professionalId: req._id}})
    .populate('patientId', 'profile.fullName')
    .populate('details.medicament', 'name')
    .then((data)=>{   
        return res.send(data);
    }).catch((err) => {
        return res.status(422).send(err);
    });
}

module.exports.getPrescription = (req, res, next ) => {
        Prescription.find(({_id: req.query.id})).limit(1)
        .populate('patientId', 'profile.fullName')
        .populate('details.medicament', 'name')
        .then((data) => {
           return res.send(...data);
       }).catch((err) => {
           return res.status(422).send(err);
       })
}
