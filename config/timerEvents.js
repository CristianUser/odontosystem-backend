const ctrlAppointment = require('./../controllers/appointment.controller');
const ctrlPatient = require('./../controllers/patient.controller');
const datefns = require('date-fns');
var oneMinute =  60000;
var oneHour = oneMinute * 60; 
var oneDay = oneHour * 24;

ctrlAppointment.parseAppointments(null, ()=>{
    console.log('events parsed! at ' + datefns.format(new Date(), 'DD/MM/YYYY - HH:mm'));
});
setInterval(() => {
    ctrlAppointment.parseAppointments(null, ()=>{
        // console.log('events parsed! at ' + datefns.format(new Date(), 'DD/MM/YYYY - HH:mm'));
    });
}, oneMinute);

ctrlAppointment.sendEmails(null, ()=>{
    console.log('emails sended!');
});
setInterval(() => {
    ctrlAppointment.sendEmails(null, ()=>{
        console.log('emails sended!');
    });
}, oneDay);

// setInterval(() => {
//     ctrlPatient.sendBirthdayEmails(null, (data)=>{
//     console.log(data);
//     });
// }, 3000);

