const smsGateway = require('sms-gateway-nodejs')('theimaginario@hotmail.com', 'polipoli');
require('colors')

if (smsGateway.device) {
    console.log('SMS Gateway initialized'.italic.cyan)
    smsGateway.device.listOfDevices().then(msj => {
        console.log(msj)
    })
}
