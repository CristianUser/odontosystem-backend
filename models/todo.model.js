const mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    userId:{
        type: String,
        ref: 'User',
        required: 'category can\'t be empty'
    },
    text: {
        type: String,
        required: 'name can\'t be empty',
    },
    status: {
        type: Boolean,
        required: 'category can\'t be empty',
        default: false
    }
});

todoSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

mongoose.model('Todo', todoSchema);
