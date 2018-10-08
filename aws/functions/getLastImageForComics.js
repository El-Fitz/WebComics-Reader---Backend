'use strict';

const AWS = require("aws-sdk");
const region = process.env.REGION;
AWS.config.region = region;
const vandium = require('vandium');
const dbHelper = require("../helpers/dynamoDB");

const comicNames = ["XKCD", "QUESTIONNABLE_CONTENT"];

exports.httpHandler = vandium.api()
    .protection()
    .GET( (event) => handleGet(event));

async function handleGet(event) {
    try {
        let comics = await Promise.all(
            comicNames
                .map((comicName) => dbHelper.getLastImageForComic(comicName)
                .then((result) => result.Items[0])
                .then((item) => { return { comicName: item.comicName, id: item.id, publishedDate: item.publishedDate, imgUrl: item.imgUrl } })
            )
        );
        return comics;
    } catch (error) {
        console.log("Error: ", error);
        return []
    }
}