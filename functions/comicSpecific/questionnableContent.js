const Comic = require("../../models/comics");
const qcIdRegex = /(questionablecontent\.net\/view\.php\?comic=)(\d*)/i
const contentRegex = /(<p>)(?!(<img src=))(.*)(?=<\/p>)/i

exports.parse = (comicName, strip) => {
    try {
        console.log("Strip: ", strip);
        let id = qcIdRegex.exec(strip.url)[2];
        let title = strip.title;
        let imageUrl = strip.image;
        let url = strip.url;
        let matchedContent = strip.content.match(contentRegex);
        console.log("Matches: ", matchedContent);
        var content;
        if (matchedContent && Array.isArray(matchedContent) && matchedContent.length > 0) content = matchedContent[matchedContent.length - 1];
        else content = undefined;
        let publishedDate = strip.published;
        return new Comic(comicName, id, title, imageUrl, url, content, publishedDate);
    } catch (error) {
        throw new Error("Invalid QuestionnableContent Comic");
    }
};

