const nodemailer = require('nodemailer');
const fs = require('fs');
const datefns = require('date-fns');
const esLocale = require('date-fns/locale/es')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'socialhealthlog@gmail.com',
           pass: 'administrador'
       }
   });
   
module.exports.sendAppointmentMail = (data) => {
     const mailOptions = {
         from: 'socialhealthlog@gmail.com', // sender address
         to: [data.patientId.contacts.email], // list of receivers
         subject: 'Dra. Inmaculada Reynodo - Recordatorio de citas', // Subject line
         html: `
         <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>JS Bin</title>
            <!-- Compiled and minified CSS -->
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

              <!-- Compiled and minified JavaScript -->
              <style>
                .title{
                  display: block;
                  text-align: center;
                }
                .logo{
                  width: 120px;
                  display: inline-block
                }
                .text{
                  display: inline-block;
                }
                .text-title{
                  margin: unset;
                }
                .text-secondary{
                  margin: unset;
                  color: rgba(0, 0, 0, 0.54);;
                }
                .content-text{
                  font-size: 18px
                }
                @media screen and (min-width: 800px) {
                  .text-container{
                    padding: 0px 15%;
                  }
                }
                
            </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
          </head>
          <body>
            <div class="">
              <span class="title">
                <img class="logo" src="https://i.imgur.com/0QAs9Sc.png?1">
                <div class="text">
                  <h4 class="text-title">Dra. Inmaculada Reynoso</h4>
                  <p class="text-secondary">Rehabilitacion Bucal</p>
                  <p class="text-secondary">Sabaneta,La Vega, (Frente a residencial Las Praderas)</p>
                </div>
              </span>
              <div class="text-container">
                <p class="content-text">
                  Buenos dias <b>${data.patientId.profile.fullName}</b> no olvide que usted tiene una cita con 
                  <b>${data.professionalId.fullName}</b> para mañana <b>${datefns.format(data.start, 'dddd D [de] MMMM[,] YYYY',
                  {locale: esLocale})}</b> a las <b>${datefns.format(data.start, "hh:mm A")}</b>.
                  Pase feliz resto del dia.
                </p>
              </div>
            </div>
          </body>
          </html>
         `// plain text body
     };
     transporter.sendMail(mailOptions, function (err, info) {
         if(err){
           console.log(err)
           return false;
         }
         else{
           console.log(info);
           return true;
         }
      });
     
}

module.exports.sendBirthdayMail = (data) => {
  const mailOptions = {
      from: 'socialhealthlog@gmail.com', // sender address
      to: [data.contacts.email], // list of receivers
      subject: 'Dra. Inmaculada Reynodo - Feliz Cumpleaños', // Subject line
      html: `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Feliz Compleaños</title>
  <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <style>
      .title{
        display: block;
        text-align: center;
      }
      .logo{
        width: 150px;
        display: inline-block
      }
      .text{
        display: inline-block;
      }
      .text-title{
        margin: unset;
      }
      .text-secondary{
        margin: unset;
        color: rgba(0, 0, 0, 0.54);;
      }
      .content-text{
        font-size: 18px
      }
      
      @media screen and (min-width: 800px) {
        .text-container{
          padding: 0px 15%;
        }
      }  
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
</head>
<body>
  <div class="">
    <span class="title">
      <img class="logo" src="https://i.imgur.com/0QAs9Sc.png?1">
      <div class="text">
        <h4 class="text-title">Dra. Inmaculada Reynoso</h4>
        <p class="text-secondary">Rehabilitacion Bucal</p>
        <p class="text-secondary">Sabaneta,La Vega, (Frente a residencial Las Praderas)</p>
        <p class="text-secondary">Tel. 809-824-0016 | Cel. 809-817-0414</p>

      </div>
    </span>
    <div class="text-container">
      <p class="content-text">
        Que tu cumpleaños sea siempre un punto de
        partida para nuevas emociones y alegrías. ¡Feliz Cumpleaños <b>${data.profile.fullName}</b>!
      </p>
    </div>
  </div>
</body>
</html>
      `// plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        console.log(err)
        return false;
      }
      else{
        console.log(info);
        return true;
      }
   });
  
}

module.exports.sendInvoiceMail = (req) => {
  
  const mailOptions = {
      from: 'socialhealthlog@gmail.com', // sender address
      to: [req.body.patient], // list of receivers
      subject: 'Dra. Inmaculada Reynodo - Factura', // Subject line
      attachments: [
    {
        filename: 'invoice.png',  
        content: req.file.buffer,                                       
        contentType: req.file.encoding
    }]// plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        console.log(err)
        return false;
      }
      else{
        console.log(info);
        return true;
      }
   });
  
}
