const mongoose = require('mongoose');
var resizable = new mongoose.Schema({
    beforeStart: {
        type:Boolean,
        default: true
    },
    afterEnd: {
        type:Boolean,
        default: true
    },

}, { _id : false })

var appliedTreatment = new mongoose.Schema ({
    id: String,
    face: String,
    tooth: String,
    bridge: Array,
    treatmentId: {
        type: String,
        ref: 'Treatment'
    },
    status: String
  },{ _id : false });


var appointmentSchema = new mongoose.Schema({
    professionalId:{
        type:String,
        ref: 'User',
        required: "professional can\'t be empty"
    },
    patientId:{
        type:String,
        ref: 'Patient',
        required: "patient can\'t be empty"
    },
    title: {
        type: String
        // required: 'title can\'t be empty'
    },
    start: {
        type: Date
        // required: 'date can\'t be empty',
        // unique: true
    },
    end: {
        type: Date
        // unique: true
    },
    color: {
        type: String
    },
    treatments: [appliedTreatment],
    status: {
        type: String,
        default: 'pendient'
    },
    cssClass: String,
    resizable: resizable,
    draggable: Boolean,
    comment: {
        type: String
    },
    emailSent: {
        type: Boolean,
        default: false
    }
});


// Events
appointmentSchema.pre('save', function (next) {
    next();
});

appointmentSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Appointment', appointmentSchema);