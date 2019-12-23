const mongoose = require('mongoose');

var medicamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name can\'t be empty'
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    }
});

medicamentSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Medicament', medicamentSchema);