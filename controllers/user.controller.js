const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
var fs = require('fs');

const User = mongoose.model('User');

module.exports.getUsers = (req, res, next) => {
    User.find({_id: { $ne: req._id }, userType: { $ne: 'secretary'}}, {fullName: 1}).then((data) => {
        return res.send(data);
    }).catch((err) => {
        return res.status(422).send(err);
    });
}

module.exports.register = (req, res, next) => {
    var user = new User();
    Object.assign(user, req.body);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.saltSecret = salt;
            user.save((err, doc) => {
                if (!err)
                res.send(doc);
                else {
                    if (err.code == 11000)
                    res.status(422).send(['Duplicate email adrress found.']);
                    else
                    return next(err);
                }
                
            });
        });
    });
}

module.exports.verifyPassword = (req, res, next) => {
    User.findOne({ _id : req._id},(err,user)=>{
        if (!err){
            if (!user.verifyPassword(req.body.password)){
                return res.status(422).send({isCorrect: false});
            } else {
                return res.send({isCorrect: true});
               }
        }
    });
}

module.exports.changePassword = (req, res, next) => {
    User.findOne({ _id : req._id},(err,user)=>{
        if (!err){
            if (!user.verifyPassword(req.body.oldPassword)){
                return res.status(422).send(['Wrong password']);
            } else {        
                user.password = req.body.newPassword;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        user.password = hash;
                        user.saltSecret = salt;
                        user.save((err, doc) => {
                            if (!err){
                                return res.status(200).json({"message":"password changed"})
                        }
                        else {
                            res.status(422).send(['Error found.']);
                        }
                        
                    });
                });
            });
        }
    }else {
        res.status(422).send(['Error found.']);
    }
    });
}

module.exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt(req) });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.uploadPicture = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const imagePath= url+ "/images/" + req.file.filename;
    User.findOneAndUpdate({ _id: req._id},{$set:{profilePath : imagePath}})
    .then((user)=>{
        user.save().then(()=>{
            return res.status(200).json({message:"photo uploaded",profilePath:user.profilePath})
        });
    });
}

module.exports.savePreferences = (req, res, next) => {
    var data = _.pick(req.body,["fixedHeader","fixedSidenav","fixedSidenavUserContent",
    "fixedFooter","sidenavIsOpened","sidenavIsPinned","menu","menuType","theme","rtl"]);

    User.findOneAndUpdate({ _id: req._id},
        {
            $set:{settings : data}
        })
    .then((user)=>{
        user.settings=data;
        console.log(user);
        user.save().then((next)=>{
            return res.status(200).json({message:"preferences saved :"})
        })
    });
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json( _.pick(user,['fullName', 'email', 'userType', 'profilePath','createdAt','settings']));
        }
    );
}