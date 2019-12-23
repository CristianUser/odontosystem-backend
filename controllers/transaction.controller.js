const mongoose = require('mongoose');
const _ = require('lodash');
var fs = require('fs');

const Transaction = mongoose.model('Transaction');
const Invoice = mongoose.model('Invoice');


module.exports.addTransaction = (req, res, next) => {
    var transaction = new Transaction();
    Object.assign(transaction,req.body);
    transaction.save((err,data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            Invoice.updateOne({_id: data.invoiceId},{
                 $inc: {balance: -data.amount},
                 status: (data.description == 'Pago total')? 'paid' : 'pendient'
                }).then((resp)=>{
                return res.send(resp)
            }).catch((err)=>{ 
                return res.status(442).send(err)
            })
            // return res.send(data);
        }
    });
}

module.exports.getTransactions = (req, res, next ) => {
    Invoice.find({...( req.userType == 'secretary')? {} : {professionalId: req._id}}, {id: 1})
    .then((data)=>{   
        Transaction.find({
            invoiceId: { $in: data.map(element => element.id)}
        })
        .populate({
            path:'invoiceId',
            select: 'patientId',
            populate: { path : 'patientId', select: 'profile.fullName'}
        }).sort({date: -1})
        .then((data) => {
           return res.send(data);
       }).catch((err) => {
           return res.status(422).send(err);
       })
    })
}

module.exports.getTransaction = (req, res, next ) => {
        Transaction.find(({_id: req.query.id}))
        .populate({
            path:'invoiceId',
            select: ['patientId', 'professionalId', 'balance'],
            populate: [
                { path : 'patientId', select: ['profile.fullName', 'contacts.email']},
                { path : 'professionalId', select: 'fullName'}]
        }).limit(1)
        .then((data) => {
           return res.send(...data);
       }).catch((err) => {
           return res.status(422).send(err);
       })
}

module.exports.cancelTransaction = (req, res, next) => {
        Transaction.findOneAndUpdate(
            {_id: req.query.id},
            {status: 'canceled'})
            .then((data) => {
                Invoice.updateOne({_id: data.invoiceId},{
                    $inc: {balance: data.amount},
                    status: 'pendient'
                    }).then((resp)=>{
                    return res.send(resp)
                }).catch((err)=>{ 
                    return res.status(442).send(err)
                })
            });

}

