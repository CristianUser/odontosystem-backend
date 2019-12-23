const mongoose = require('mongoose');
const _ = require('lodash');
const dateFns = require('date-fns');
const Linq = require('linq');

const Appointment = mongoose.model('Appointment');
const User = mongoose.model('User');
const Invoice = mongoose.model('Invoice');
const Transaction = mongoose.model('Transaction');
const Patient = mongoose.model('Patient');

module.exports.getTiles = (req, res, next) => {
    let response = {};
    Patient.count({...( req.userType == 'secretary')? {} : {professionalId: req._id}},(err, count)=> {
        response.patientsNumber = count;
        // checkpoint
        Appointment.count({
            ...( req.userType == 'secretary')? {} : {professionalId: req._id},
            start: { $gt: dateFns.subDays(new Date(), 30)},
            status: ['completed',]
        },(err, count)=> {
            response.completedAppointments = count;
            // checkpoint
            Appointment.count({
                ...( req.userType == 'secretary')? {} : {professionalId: req._id},
                start: { $exists: true },
                status: ['delayed',]
            },(err, count)=> {
                response.delayedAppointments = count;
                // checkpoint
                Invoice.find({...( req.userType == 'secretary')? {} : {professionalId: req._id}}).then(data => {
                    Transaction.find({
                        invoiceId: { $in: data.map(element => element.id)},
                        date: { $gt: dateFns.subDays(new Date(), 30)}
                    },(err, data1)=> {
                        response.transactionsNumber = data1.length;
                        response.earnings = data1.reduce(function (accumulator, currentValue) {return accumulator + currentValue.amount;},0);
                        return res.send(response);
                    });
                });
            });
        });
    });
}

module.exports.getInfoCards = (req, res, next) => {
    let response = {}
    Invoice.find({})
    .populate('details.treatmentId', 'name')
    .then(data=>{
            let resp = [];
            data.forEach(element => {
               resp.push(...element.details);
            })
            var linq = Linq.from(resp);
            var result =
                linq.groupBy(function(x){return x.treatmentId;})
                    .select(function(x){return { treatmentId:x.key(), price: x.sum(function(y){return parseInt(y.price)|0;}) };})
                    .toArray();
                    response.bestTreatments = result;
            return res.send(response);

    }).catch(err => {
        return res.send(err);
    });
}
