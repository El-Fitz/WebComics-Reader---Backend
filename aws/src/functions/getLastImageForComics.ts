/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-30 10:52:02 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-30 11:22:18
 */

"use strict"
// tslint:disable-next-line: no-require-imports no-var-requires
const vandium = require("vandium")
import { Provider } from "../providers/dynamoDB"
const provider = new Provider()

const comicNames = ["XKCD", "QUESTIONNABLE_CONTENT"]

// tslint:disable-next-line: no-unsafe-any
exports.httpHandler = vandium.api()
	.protection()
	.GET(handleGet)

async function handleGet() {
	try {
		return await Promise.all(comicNames.map((comicName) => provider.getLatestStripFor(comicName)))
	} catch (error) {
		console.log("Error: ", error)
		return []
	}
}
