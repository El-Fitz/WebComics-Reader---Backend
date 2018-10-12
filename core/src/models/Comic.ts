/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-12 13:20:20 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-12 13:45:35
 */

// import { Comic } from "../../models/Comic";

export class Comic {
	comicName: string;
	id: string;
	title: string;
	imgUrl: string;
	url: string;
	content: string;
	publishedDate: string;

    constructor(comicName: string, id: string, title: string, imgUrl: string, url: string, content: string, publishedDate: string) {
        this.comicName = comicName
        this.id = id
        this.title = title;
        this.imgUrl = imgUrl;
        this.url = url;
        this.content = content;
        this.publishedDate = publishedDate;
	}
	
	public static parse(comicName: string, strip: object): Comic { 
        throw new Error("Cannot call parse on abstract Comic Class");
    }
};