const mongoose = require('mongoose');
const colors = require('colors');

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'.green); }
    else { console.log('Error in MongoDB connection : '.red + JSON.stringify(err, undefined, 2).red); }
});

require('./appointment.model');
require('./invoice.model');
require('./patient.model');
require('./prescription.model');
require('./static.model');
require('./todo.model');
require('./transaction.model');
require('./user.model');
require('./treatment.model');
require('./medicament.model');