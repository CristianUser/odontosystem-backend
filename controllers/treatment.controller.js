const mongoose = require('mongoose');
const _ = require('lodash');
var fs = require('fs');

const Treatment = mongoose.model('Treatment');
const TreatmentPrice = mongoose.model('TreatmentPrice')


module.exports.add = (req, res, next) => {
    var treatment = new Treatment();
    Object.assign(treatment, req.body);
    treatment.save((err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    });
}

module.exports.updateTreatment = (req, res, next) => {
    var treatment = new Treatment();
    Object.assign(treatment,req.body);
    // medicament.professionalId = req._id;
    treatment._id=req.body.id;
    delete treatment.id;
    Treatment.replaceOne({_id: req.body.id},treatment,//{ upsert: true },
        (err,data)=>{
            if (err){
                return res.status(442).send(err);
            }else{
                return res.status(200).send(data);
            }
    });
}

module.exports.addPrice = (req, res, next) => {
    var treatmentPrice = new TreatmentPrice();
    Object.assign(treatmentPrice, req.body);
    TreatmentPrice.updateMany({ treatmentId: req.body.treatmentId}, {status: 'disabled'}).then(data => {
        treatmentPrice.save((err, data) => {
            if(err){
                return res.status(422).send({err: err});
            } else {
                return res.send(data);
            }
        });
    })
}

module.exports.getTreatments = (req, res, next) => {
    TreatmentPrice.find({status:'active'}).then(prices => {
        Treatment.find({status: 'active'}).then(data => {
            data = data.map(element => {
                var price = prices.filter(val => (val.treatmentId === element.id))[0]
               element.price = (price)? price.price: price;
            //    console.log(element.price)
                return element;
            })
            return res.send(data);
        }).catch(err => {
            return res.status(422).send({err: err});
        })
    })
}

// module.exports.getTreatments = (req, res, next) => {
//     TreatmentPrice.find({status:'active'}).then(prices => {
//         Treatment.find({}).then(data => {
//             return res.send(data);
//         }).catch(err => {
//             return res.status(422).send({err: err});
//         }) 
//     })
// }

module.exports.getTreatment = (req, res, next) => {
    Treatment.find({_id: req.body._id}).limit(1).then(data => {
        return res.send(...data);
    }).catch(err => {
        return res.status(422).send({err: err});
    })
}

module.exports.delete= (req, res, next) => {
    Treatment.updateOne({_id: req.body.id}, {status: 'disabled'}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}

module.exports.changeStatus = (req, res, next) => {
    TreatmentPrice.updateOne({_id: req.body.id}, {status: req.body.status}, (err, data) => {
        if(err){
            return res.status(422).send({err: err});
        } else {
            return res.send(data);
        }
    })
}