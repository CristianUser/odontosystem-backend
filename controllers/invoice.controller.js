const mongoose = require('mongoose');
const mailer = require('./../config/nodemailer');

const Invoice = mongoose.model('Invoice');
const Transaction = mongoose.model('Transaction');

module.exports.add = (req, res, next) => {
    var invoice = new Invoice();
    Object.assign(invoice,req.body);
    invoice.save((err,data) => {
        if(err){
            return res.status(422).send({err});
        } else {
            return res.send(data);
        }
    });
}

module.exports.getInvoices = (req, res, next ) => {
     Invoice.find({
        ...( req.userType == 'secretary')? {} : {professionalId: req._id},
     }).populate('patientId', 'profile.fullName').sort({date: -1}).then((data)=>{
        return res.send(data);
    }).catch((err)=> {
        return res.status(422).send({err});
    });
}

module.exports.verifyInvoice = (req, res, next ) => {
    Invoice.find({appointmentId: req.query.id}).limit(1).then((data)=>{
        return res.send(data);   
   }).catch((err)=>{
        return res.status(422).send({err});
   });
}

module.exports.getInvoice = (req, res, next ) => {
    Invoice.find({_id: req.query.id}).limit(1)
    .populate('patientId', ['profile.fullName', 'contacts.address', 'contacts.email'])
    .populate('professionalId', 'fullName')
    .populate('details.treatmentId', 'name')
    .then((data)=>{
        return res.send(...data);   
   }).catch((err)=>{
        return res.status(422).send({err});
   });
}

module.exports.getPatientBalance = (req, res, next ) => {
    Invoice.find({
        patientId: req.query.id,
        ...( req.userType == 'secretary')? {} : {professionalId: req._id}
    }, { "details.price": 1, balance: 1}).then((data)=>{
        return res.send({
            balance: data.reduce(function (accumulator, currentValue) {return accumulator + currentValue.balance;},0),
            total: data.reduce(function (accumulator, currentValue) {
                let total = currentValue.details.reduce(function (accumulator, currentValue) {
                    return accumulator + parseInt(currentValue.price);},0);
                return accumulator + total;
            },0)
        });   
   }).catch((err)=>{
        return res.status(422).send({err});
   });
}

module.exports.cancelInvoice = (req, res, next ) => {
    Invoice.updateOne({_id: req.query.id}, {status: 'canceled'}).then((data)=>{
        Transaction.updateMany({invoiceId: req.query.id}, {status: 'canceled'})
        .then(data => {
            return res.send(data);   
        })
        .catch(err => {
            return res.status(422).send(err);
        });
   }).catch((err)=>{
        return res.status(422).send(err);
   });
}

module.exports.sendInvoice = (req, res, next ) => {
    mailer.sendInvoiceMail(req)
}
