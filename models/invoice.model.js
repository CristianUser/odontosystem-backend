const mongoose = require('mongoose');

var detail = new mongoose.Schema({
    treatmentId: {
        type: String,
        ref: 'Treatment'
    },
    price: String
},{ _id : false });

var invoiceSchema = new mongoose.Schema({
    patientId: {
        type: String,
        ref: 'Patient',
        required: 'patientId can\'t be empty'
    },
    professionalId: {
        type: String,
        ref: 'User',
        required: 'professionalId can\'t be empty'
    },
    appointmentId: {
        type: String,
        ref: 'Appointment',
        unique: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    details: {
        type: [detail],
        required: 'details can\'t be empty'
    },
    status: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    }
});

// Events
invoiceSchema.pre('save', function (next) {
    next();
});

invoiceSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Invoice', invoiceSchema);