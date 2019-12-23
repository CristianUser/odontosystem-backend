require('./config/config');
require('./models/db');
require('./config/passportConfig');
require('./config/timerEvents');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require("path");
// const smsGateway = require('./middleware/sms.middleware');

// smsGateway.initialize();

const rtsIndex = require('./routes/index.router');

const morgan = require('morgan');
const colors = require('colors');

var app = express();



// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use("/images", express.static(path.join("images")));
app.use("/", express.static(path.join("views")));

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    } else {
        console.log(err+''.red);
    }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`.blue));