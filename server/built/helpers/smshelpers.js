require('dotenv').config();
const accountSid = process.env.TWILIO_accountSid;
const authToken = process.env.TWILIO_authToken;
const defaultPhoneNum = process.env.DEFAULT_NUMBER;
const client = require('twilio')(accountSid, authToken);
export function sendAlert(siteName, numbers = [defaultPhoneNum]) {
    numbers.forEach(number => {
        client.messages
            .create({
            body: `Flooding detected at ${siteName}`,
            from: '+17135974919',
            to: `+1${defaultPhoneNum}`
        })
            .then(message => console.log(message.sid));
    });
}
export function sendSignUpText(phoneNumber = defaultPhoneNum) {
    /*All texts get send by default to my phone number, will replace after
    I can make sure user's numbers are stored securely*/
    client.messages
        .create({
        body: `You'll recieve alerts from this number when flooding is detected near you`,
        from: '+17135974919',
        to: phoneNumber
    })
        .then(message => console.log(message.sid));
}
