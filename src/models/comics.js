class Comic {
    constructor(comicName, id, title, imgUrl, url, content, publishedDate) {
        this.comicName = comicName
        this.id = id
        this.title = title;
        this.imgUrl = imgUrl;
        this.url = url;
        this.content = content;
        this.publishedDate = publishedDate;
    }
};

module.exports = Comic;