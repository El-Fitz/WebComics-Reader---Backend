'use strict';

const AWS = require("aws-sdk");
const region = process.env.REGION;
AWS.config.region = region;
const vandium = require('vandium');
const newStrip = require("webcomics-reader-webservices").newStrip;
const dbHelper = require("../helpers/dynamoDB");

exports.httpHandler = vandium.api()
    .protection()
    .POST({
            body: {
                title: vandium.types.string().required(),
                url: vandium.types.string().required(),
                content: vandium.types.string().required(),
                image: vandium.types.string().min(20).required(),
                published: vandium.types.string().required()
            }
        },
        (event) => handlePost(event)
    )
    .onError( (err) => {
        console.log("Error: " + err);
        return err
    });

async function handlePost(event) {
    try {
        let comicName = event.pathParameters.comicName;
        let strip = event.body;
        let parsedStrip = newStrip(stirp, comicName);
        console.log("Parsed Strip: ", parsedStrip);
        let dbPostResult = await dbHelper.postNewStrip(parsedStrip);
        console.log("DB Post Result: ", dbPostResult);
        return "Done";
    } catch (error) {
        console.log("Event: ", event);
        console.log("Error: ", error);
        return "Failed"
    }
};
