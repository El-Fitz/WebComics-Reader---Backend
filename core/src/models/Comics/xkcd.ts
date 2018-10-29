/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-12 13:19:59 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-12 13:49:33
 */

import { Comic } from "../Comic";

export class XKCD extends Comic {

	static idRegex = /(xkcd.com\/)(\d*)/i;
	static contentRegex = /(alt=")(.*)(")/i;

	public static parse = (comicName: string, strip: any): Comic => {
		try {
			let idRegexResult = XKCD.idRegex.exec(strip.url);
			if (idRegexResult === null || idRegexResult.length < 3) {
				throw new Error("Id regex failed for comic: " + comicName);
			}
			let id = idRegexResult[2];
			let title = strip.title;
			let imageUrl = strip.image;
			let url = strip.url;

			let contentRegexResult = XKCD.contentRegex.exec(strip.content);
			if (contentRegexResult === null || contentRegexResult.length < 3) {
				throw new Error("Content regex failed for comic: " + comicName);
			}
			let content = contentRegexResult[2];
			let publishedDate = strip.published;
			let comic = new Comic(comicName, id, title, imageUrl, url, content, publishedDate);
			return comic;
		} catch (error) {
			console.log("Error: ", error);
			throw new Error("Invalid XKCD Comic");
		}
	}
}