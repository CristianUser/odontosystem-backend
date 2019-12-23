const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

var PatientProfile = new Schema ({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    birthday: {
        type: Date
    },
    gender: String,
    idCard: String,
    image: String,
    patientComments: String
  },{ _id : false });

var PatientContacts = new Schema ({
    email: {
        type: String
    },
    phone: String,
    address: String
  },{ _id : false });

var BacterialPlaqueControl = new Schema ({
    dest: String,
    c11: String,
    c32: String,
    c44: String,
    c26: String,
    c16: String,
     tP: String
  },{ _id : false });

 var PatientSettings = new Schema ({
    isActive: {
      type:Boolean,
      default: true
    },
    isDeleted: {
      type:Boolean,
      default: false
    },
    registrationDate: {
        type: String,
        default: new Date().toISOString()
    },
    bgColor: {
        type: String,
        default: 'gradient-pink'
    }
  },{ _id : false });
var patientSchema = new Schema({
    professionalId: {
      type: [String],
      ref: 'User'
    },
    profile: PatientProfile,
    contacts: PatientContacts,
    clinicHistorical: Array,
    patientTest: Array,
    bacterialPlaqueControl: [BacterialPlaqueControl],
    dentalOcclusion: String,
    settings: PatientSettings
});

// Custom validation for email
PatientContacts.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(val){
      return emailRegex.test(val);
    }
}, 'Invalid e-mail.');

// Events
patientSchema.pre('save', function (next) {
    next();
});

patientSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 



mongoose.model('Patient', patientSchema);