const comics = require("../../models/comics");
const xkcd = require("../comicSpecific/xkcd");
const qc = require("../comicSpecific/questionnableContent");

exports.parseNewStrip = (strip, comicName) => {
    switch (comicName) {
        case "XKCD":
            return xkcd.parse(comicName, strip);
        case "QUESTIONNABLE_CONTENT":
            return qc.parse(comicName, strip);
        case "COMMIT_STRIP":
            return
    }
}