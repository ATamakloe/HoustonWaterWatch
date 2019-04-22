require('dotenv').config();

const accountSid = process.env.TWILIO_accountSid;
const authToken = process.env.TWILIO_authToken;
const defaultPhoneNum = process.env.DEFAULT_NUMBER;
const client = require('twilio')(accountSid, authToken);


export function sendAlert(siteName: string, numbers: Array<string> = [defaultPhoneNum]) {
  numbers.forEach(number => {
    client.messages
      .create({
        body: `Flooding detected at ${siteName}`,
        from: '+17135974919',
        to: `+1${defaultPhoneNum}`
      })
      .then(message => console.log(message.sid));
  })
}

export function sendSignUpText(phoneNumber: string = '8325665148') {
  //add phoneNumber after switching from trial account
  client.messages
    .create({
      body: `You'll recieve alerts from this number when flooding is detected near you`,
      from: '+17135974919',
      to: phoneNumber
    })
    .then(message => console.log(message.sid))
}
