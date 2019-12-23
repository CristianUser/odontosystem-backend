const mongoose = require('mongoose');
const Schema = mongoose.Schema;



var PrescriptionDetails = new Schema({
    medicament: {
        type: String,
        ref: 'Medicament'
    },
    indications: String,
}, {_id: false});


var prescriptionSchema = new Schema({
    appointmentId: {
        type: String,
        ref: 'Appointment'
    },
    professionalId: {
        type: String,
        ref: 'User'
    },
    patientId: {
        type: String,
        ref: 'Patient'
    },
    details: [PrescriptionDetails],
    date: {
        type: Date,
        default: new Date()
    }
});

prescriptionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Prescription', prescriptionSchema);