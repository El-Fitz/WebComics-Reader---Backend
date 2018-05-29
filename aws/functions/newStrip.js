'use strict';

const AWS = require("aws-sdk");
const region = process.env.REGION;
AWS.config.region = region;
const vandium = require('vandium');

exports.httpHandler = vandium.api()
    .protection()
    .HEAD( (event) => {
        throw new Error( 'Flow Not Found' );
    })
    .GET( (event) => {
        throw new Error( 'Flow Not Found' );
    })
    .POST( (event) => {
        return handlePost(event);
    })
    .PUT( (event) => {
        throw new Error( 'Flow Not Found' );
    })
    .PATCH( (event) => {
        throw new Error( 'Flow Not Found' );
    })
    .DELETE( (event) => {
        throw new Error( 'Flow Not Found' );
    });
// .onError( (err) => {
//     if( err.message.indexOf( 'Not Found' ) > -1 ) err.statusCode = 404;
//     return err;
// });


function handlePost(event) {
    console.log("Event: ", event);
    return {  message: event }
}
