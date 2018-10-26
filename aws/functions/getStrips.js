'use strict';

const AWS = require("aws-sdk");
const region = process.env.REGION;
AWS.config.region = region;
const vandium = require('vandium');
const provider = require("../providers/dynamoDB");

exports.httpHandler = vandium.api()
    .protection()
    .GET( (event) => handleGet(event));

async function handleGet(event) {
    let comicName = event.pathParameters.comicName;
    let results = await provider.getStripsFor(comicName);
    console.log("Results: ", results);
    return results.Items.reverse();
}
