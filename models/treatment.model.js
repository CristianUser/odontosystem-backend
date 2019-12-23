const mongoose = require('mongoose');

var treatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name can\'t be empty',
    },
    description: {
        type: String,
        required: 'category can\'t be empty'
    },
    status:{
        type: String,
        default: 'active'
    },
    applyFace: Boolean,
    applyTooth: Boolean,
    cursor:{
        type: String,
        default: 'standard'
    },
    price: String
});

treatmentSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

var treatmentPriceSchema = new mongoose.Schema({
    treatmentId:{
        type: String,
        required:   'treatmentId can\'t be empty',
        ref: 'Treatment'
    },
    price: {
        type: String,
        required: 'price can\'t be empty',
    },
    date: {
        type: Date,
        default: new Date()
    },
    status:{
        type: String,
        default: 'active'
    }
});

treatmentPriceSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('TreatmentPrice', treatmentPriceSchema);

mongoose.model('Treatment', treatmentSchema);