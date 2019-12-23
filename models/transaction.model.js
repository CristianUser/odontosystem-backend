const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
    invoiceId: {
        type: String,
        ref: 'Invoice',
        required: 'invoiceId can\'t be empty'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: 'paid'
    },
    amount: {
        type: Number
    }
});

// Events
transactionSchema.pre('save', function (next) {
    next();
});

transactionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Transaction', transactionSchema);