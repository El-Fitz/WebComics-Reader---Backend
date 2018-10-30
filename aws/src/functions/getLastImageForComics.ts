/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-30 10:52:02 
 * @Last Modified by:   Thomas Léger 
 * @Last Modified time: 2018-10-30 10:52:02 
 */

"use strict"
// tslint:disable-next-line: no-require-imports no-var-requires
require("honeycomb-beeline")({
	writeKey: "6b6077b2b06c946f9792f655444b5d65",
	dataset: "webcomics-backend",
})
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
