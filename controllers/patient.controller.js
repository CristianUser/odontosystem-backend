const mongoose = require('mongoose');
const _ = require('lodash');

const Patient = mongoose.model('Patient');

module.exports.register = (req, res, next) => {
    var patient = new Patient();
    req.body.settings = _.omitBy(req.body.settings,_.isNil);
    Object.assign(patient,req.body);
    patient.professionalId = req.body.professionalId;
    patient.save((err,data) => {
        if(err){
            return res.send({err: err});
        } else {
            return res.send(data);
        }
    });
}

module.exports.registerPatients = (req, res, next) => {
    Patient.insertMany(req.body).then((data) => {
        return res.send(data);
    }).catch((err)=>{
        return res.send({err: err});
    })
}

module.exports.updatePatient = (req, res, next) => {
    var patient = new Patient();
    Object.assign(patient,req.body);
    patient._id=req.body.id;
    delete patient.id;
    // patient.professionalId = req._id;
    Patient.replaceOne({_id: req.body.id},patient,// { upsert: true },
        (err,data)=>{
            if (!err){
                return res.send(data);
            }else{
                return res.status(442).send({err:err});
            }
    });
}
//recuerda buscar los then para revisar si tienen el parametro err
module.exports.getPatients = (req, res, next ) => {
    Patient.find(
        {        ...( req.userType == 'secretary')? {} : {professionalId: req._id},
        "settings.isDeleted": false}
        )
        .then((data)=>{
            return res.send(data);
    }).catch((err)=>{
        return res.send({err: err});
    })
}

module.exports.getPatientsReduced = (req, res, next ) => {
    Patient.find({
        ...( req.userType == 'secretary')? {} : {professionalId: req._id},
        "settings.isDeleted": false
    }
        
    ,
        {'profile.fullName': 1}).then((data)=>{
        var response = [] ; 
        data.forEach((val)=>{
            response.push({
                fullName: val.profile.fullName,
                id: val._id
            })
        })
        return res.send(response);
    }).catch((err)=>{
        return res.send({err: err});
    })
}

module.exports.getOtherPatients = (req, res, next ) => {
    Patient.find(
        {
            professionalId : {$ne: req._id },
            "settings.isDeleted": false
        }
    ,
        {'profile.fullName': 1}).then((data)=>{
        var response = [] ; 
        data.forEach((val)=>{
            response.push({
                fullName: val.profile.fullName,
                id: val._id
            })
        })
        return res.send(response);
    }).catch((err)=>{
        return res.send({err: err});
    })
}

module.exports.getPatient = (req, res, next ) => {
    Patient.findOne({_id: req.query.id},(err,data)=>{
        if(err){
            return res.send({err: err});
        } else {
            return res.send(data);
        }
    });
}

module.exports.importPatient = (req, res, next ) => {
    Patient.findOneAndUpdate({_id: req.body.id},{ $addToSet: { professionalId: req._id }}).then((data) =>{
        data.save().then((next)=>{
            return res.status(200).json({message:'patient imported'})
        })
    }).catch((err) => {
        return res.status(442).send(err);
    });
}

// module.exports.removePatient = (req, res, next ) => {
//     Patient.deleteOne({_id : req.body.id, professionalId: req._id},(err,data)=>{
//         if(err){
//             return res.send({err: err});
//         } else {
//             return res.send(data);
//         }
//     });
// }

module.exports.removePatient = (req, res, next ) => {
    Patient.updateOne({_id : req.body.id, professionalId: req._id}, {"settings.isDeleted": true},(err,data)=>{
        if(err){
            return res.send({err: err});
        } else {
            return res.send(data);
        }
    });
}



module.exports.sendBirthdayEmails = (error, next ) => {
    var now = new Date();
    var day = now.getDate();        // funny method name but that's what it is
    var month = now.getMonth() + 1; // numbered 0-11
    
    
    Patient.aggregate(
        [
            { "$project": {
                "profile.fullName": 1,
                "profile.birthday": 1,
                "day": {"$dayOfMonth": "$profile.birthday"},
                "month": {"$month" : "$profile.birthday"}
            }},
            { "$match": { 
                "day": day,
                "month": month
            }}
        ]
    )
        .then(data => {
            next(data);
        }).catch(err => {
            console.log(err)
        })
}