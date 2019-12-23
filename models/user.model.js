const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    emailStatus : {
        type: String,
        default: "toConfirm"
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    profilePath: {
        type: String,
        default: ''
    },
    settings: Object,
    createdAt: {
        type: Number,
        default: Date.now()
    },
    lastSeenAt: {
        type: Number,
        default: 0
    },
    passwordResetToken: {
        type: String,
        default: ''
    },
    passwordResetTokenExpiresAt: {
        type: Number,
        default: 0
    },
    emailProofToken: {
        type: String,
        default: ''
    },
    emailProofTokenExpiresAt: {
        type: Number,
        default: 0
    },
    userType: {
        type: String
    },
    saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
userSchema.pre('save', function (next) {
    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(this.password, salt, (err, hash) => {
    //         this.password = hash;
    //         this.saltSecret = salt;
    //         next();
    //     });
    // });
    next();
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function (req) {
    expireTime=process.env.JWT_EXP
    if(req.body.rememberMe){
        expireTime="365d";
    }
    return jwt.sign(
        { 
            _id: this._id,
            userType: this.userType
        },
        process.env.JWT_SECRET,
    {
        expiresIn: expireTime
    });
}

userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('User', userSchema);
