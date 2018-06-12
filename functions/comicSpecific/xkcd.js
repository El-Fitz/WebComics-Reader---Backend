const Comic = require("../../models/comics");
const xkcdIdRegex = /(xkcd.com\/)(\d*)/i
const contentRegex = /(alt=")(.*)(")/i

exports.parse = (comicName, strip) => {
    try {
        let id = xkcdIdRegex.exec(strip.url)[2];
        let title = strip.title;
        let imageUrl = strip.image;
        let url = strip.url;
        let content = contentRegex.exec(strip.content)[2];
        let publishedDate = strip.published;
        let comic = new Comic(comicName, id, title, imageUrl, url, content, publishedDate);
        return comic;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Invalid XKCD Comic");
    }
};

