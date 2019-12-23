const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({$or:[{ email: username }, { username:username }]},
                (err, user) => {
                    if (err){
                        return done(err);
                    }
                    // unknown user
                    else if (!user){
                        return done(null, false, { wrongUser: true, message: 'Email is not registered' });
                    }
                    // wrong password
                    else if (!user.verifyPassword(password)){
                        return done(null, false, { wrongUser: false, wrongPassword: true, message: 'Wrong password!.' });
                    }
                    // authentication succeeded
                    else{
                        user.lastSeenAt = Date.now();
                        user.save();           
                        return done(null, user);
                    }
                });
        })
);