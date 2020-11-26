const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const nodemailer = require('nodemailer');
const dayjs = require('dayjs');
const uuid = require('uuid');

export const postReservation = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const { minionsList, name, email, phone, cep, address } = body;
    const time = dayjs().format('DD/MM/YYYY - HH:mm:ss');

    sendEmail(name, email, time, phone, minionsList);

    const userId = uuid.v4();
    const saveReservation = {
        userId,
        name,
        email,
        phone,
        cep,
        address,
        time,
        minionsList
    };

    return dynamo.put({
        TableName: 'minions-store-reservation',
        Item: saveReservation
    }).promise().then(() => {
        callback(null, response(201, saveReservation));
    }).catch(err => callback(null, response(err.statusCode, err)));
};

function sendEmail(name, email, time, phone, minionsList) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        auth: {
            user: 'alicetestebgc@gmail.com',
            pass: 'teste2BGC'
        }
    });

    const mailOptions = {
        from: '"Minions Store" <alicetestebgc@gmail.com>',
        to: `${email}`,
        subject: 'Your reservation',
        html: `<b>Thank you, ${name}, for shopping with us!</b><br>
        <p>Your reservation has been made ${time}</p>
        <p>Your phone number is ${phone}</p>
        <p>Your Minions</p>
        <ul><li>${minionsList.map((m) => m.name )}</li></ul>
        <p>If any information is wrong, reply to this email with the correction.</p><br/><br/>
        <p>Graciously,</p>
        <p>Minions store team</p>`
    };

    transporter.sendMail(mailOptions);
}

function response(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(message)
    };
}