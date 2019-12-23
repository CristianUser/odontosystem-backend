const mongoose = require('mongoose');
const _ = require('lodash');
const mailer = require('./../config/nodemailer');
const dateFns = require('date-fns');

const Appointment = mongoose.model('Appointment');
const User = mongoose.model('User');


module.exports.add = (req, res, next) => {
    var appointment = new Appointment();
    Object.assign(appointment,req.body);
    appointment.save((err,data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.status(201).send(data);
        }
    });
}

module.exports.getAppointments = (req, res, next ) => {
        Appointment.find({
            ...( req.userType == 'secretary')? {} : {professionalId: req._id},
            start: {$exists: true},
            start: {
                $gte: req.query.start,
                $lt: req.query.end
             }
        }).sort({start: 1}).then((data)=>{
            return res.status(200).send({status:"Ok", results:data});
        }).catch((err)=>{
            return res.status(422).send({err: err});
        })
}

module.exports.getAppointment = (req, res, next ) => {
    Appointment.find({
        ...( req.userType == 'secretary')? {} : {professionalId: req._id},
        start: {$exists: true},
        start: {
            $gte: req.query.start,
            $lt: req.query.end
         }
    })
    .sort({start: 1}).then((data)=>{
        return res.status(200).send({status:"Ok", results:data});
    }).catch((err)=>{
        return res.status(422).send({err: err});
    })
}

module.exports.getPatientAppointments = (req, res, next ) => {
    Appointment.find({
        ...( req.userType == 'secretary')? {} : {professionalId: req._id},
        patientId: req.query.id,
        status: { $in: req.query.status}})
        .sort({start: 1})
        .then((data)=>{
            return res.status(200).send(data);
        }).catch((err)=>{
            return res.status(422).send({err: err});
    });
}

module.exports.getAppointmentsInRange = (req, res, next ) => {
    Appointment.find({ ...( req.userType == 'secretary')? {} : {professionalId: req._id},
        status: {
         $in: req.query.status},
         start: {
            $gte: req.query.start,
            $lt: req.query.end
         }
        })
        .sort({start: 1})
        .then( data =>{
            return res.status(200).send(data);
        }).catch(err =>{
        return res.status(422).send(err);
    })
}

module.exports.completeAppointment = (req, res, next) => {
    var appointment = new Appointment();
    Object.assign(appointment,req.body);
    appointment._id=req.body.id;
    appointment = _.omit(appointment, ['end', 'id'])
    Appointment.find(
        {
            professionalId: appointment.professionalId,
            patientId: appointment.patientId,
            status: 'todo'
        }, (err, data) => {
            data = data.map((value, i) => {
                 value.treatments.map((val) => {
                    for(let x = 0;x < appointment.treatments.length ; x++) {
                        if (
                            (appointment.treatments[x].bridge === val.bridge || appointment.treatments[x].tooth === val.tooth) &&
                            appointment.treatments[x].face === val.face && appointment.treatments[x].treatment === val.treatment) {
                                value.treatments = []
                                return value
                        }
                    };
                    return value
                });
                if (!value.treatments.length){
                    console.log('delete ' + value.id)
                    Appointment.deleteOne({_id: value.id, status: 'todo'},//{ upsert: true },
                        (err,data)=>{
                            if (err){
                                return res.status(442).send(err);
                            }else{
                                // return res.send(data);
                            }
                    });

                } else {
                    Appointment.updateOne({_id: value.id},{ treatments: value.treatments},//{ upsert: true },
                        (err,data)=>{
                            if (err){
                                return res.status(442).send(err);
                            }else{
                                // console.log(data)
                            }
                    });
                }
                return value
            });
            Appointment.replaceOne({_id: req.body.id},appointment,//{ upsert: true },
                (err,data)=>{
                    if (err){
                        return res.status(442).send(err);
                    }else{
                        return res.send(data);
                    }
            });
        // return res.send(data)
    });
}

module.exports.updateAppointment = (req, res, next) => {
    var appointment = new Appointment();
    Object.assign(appointment,req.body);
    // appointment.professionalId = req._id;
    appointment._id=req.body.id;
    delete appointment.id;
    Appointment.replaceOne({_id: req.body.id},appointment,//{ upsert: true },
        (err,data)=>{
            if (err){
                return res.status(442).send(err);
            }else{
                return res.status(200).send(data);
            }
    });
}

module.exports.parseEvents = (req, res, next ) => {
    Appointment.updateMany({start: {$lt: new Date().toISOString()}, status: 'pendient' }, { status: 'delayed' },(err,data)=>{
        if(err){
            return res.send(err);
        } else {
            next();
            return res.status(200).send(data);
        }
    });
}

module.exports.parseAppointments = (error, next) => {
    Appointment.updateMany({start: {$lt: new Date().toISOString()}, status: 'pendient' }, { status: 'delayed' }).then(data=>{
        return next();
    }).catch(err => {
        return error();
    });
}

module.exports.sendEmails = (error, next ) => {
    Appointment.find({
        start: {
            $gte: dateFns.startOfTomorrow(),
            $lt: dateFns.endOfTomorrow()
         },
         status: 'pendient' }).populate(
             {
                 path: 'patientId',
                 select: ['contacts', 'profile.fullName']
             }
         ).populate(
            {
                path: 'professionalId',
                select: 'fullName'
            }
        ).then((data)=>{
            data.forEach(element => {
                if(!element.emailSent && element.patientId.contacts.email){
                    mailer.sendAppointmentMail(element);
                    Appointment.updateOne({_id: element.id},{ emailSent: true });
                }
            })
            return next();
    }).catch((err) => {
        return error();
    });
}

module.exports.removeEvent = (req, res, next ) => {
    Appointment.deleteOne({_id : req.body.id},(err,data)=>{
        if(err){
            return res.send({err: err});
        } else {
            return res.status(200).send(data);
        }
    });
}

module.exports.getPatientOdontogram = (req, res, next ) => {
    Appointment.find({
        ...( req.userType == 'secretary')? {} : {professionalId: req._id},
        patientId: req.query.patientId, "treatments": { $exists: true}},(err,data)=>{
       if (err) {
           return res.status(422).send({err: err});
       } else {
        let response = [];
        data.map((element, i) => {
            element.treatments.map(val => {
                val.status = element.status;
                val.id = element._id;
                if (!val.bridge.length){
                    val.bridge = null
                }
            });
            response.push(...element.treatments);
         })
        return res.send(response);
       }
   });
}

