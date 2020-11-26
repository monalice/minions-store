const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

export const getProducts = async (event, context, callback) => {
    return dynamo.scan({
        TableName: 'minions-store-products'
    }).promise().then(res => {
        callback(null, response(200, res.Items));
    }).catch(err => callback(null, response(err.statusCode, err)));
};

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