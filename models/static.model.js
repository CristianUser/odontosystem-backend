const mongoose = require('mongoose');

var staticSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name can\'t be empty',
        unique: true
    },
    category: {
        type: String,
        required: 'category can\'t be empty'
    }
});

// Events
staticSchema.pre('save', function (next) {
    next();
});

staticSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Static', staticSchema);