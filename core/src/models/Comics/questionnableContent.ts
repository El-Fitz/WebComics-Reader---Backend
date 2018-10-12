/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-12 13:11:33 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-12 13:50:01
 */
import { Comic } from "../Comic";

export class QuestionnableContent extends Comic {

	static idRegex = /(questionablecontent\.net\/view\.php\?comic=)(\d*)/i;
	static contentRegex = /(<p>)(?!(<img src=))(.*)(?=<\/p>)/i;

	public static parse = (comicName: string, strip: any): Comic => {
		try {
			let idRegexResult = QuestionnableContent.idRegex.exec(strip.url);
			if (idRegexResult === null || idRegexResult.length < 3) {
				throw new Error("Id regex failed for comic: " + comicName);
			}
			let id = idRegexResult[2];
			let title = strip.title;
			let imageUrl = strip.image;
			let url = strip.url;
			let matchedContent = strip.content.match(QuestionnableContent.contentRegex);
			var content;
			if (matchedContent && Array.isArray(matchedContent) && matchedContent.length > 0) content = matchedContent[matchedContent.length - 1];
			else content = undefined;
			let publishedDate = strip.published;
			return new Comic(comicName, id, title, imageUrl, url, content, publishedDate);
		} catch (error) {
			console.log("Error: ", error);
			throw new Error("Invalid QuestionnableContent Comic");
		}
	}
};
