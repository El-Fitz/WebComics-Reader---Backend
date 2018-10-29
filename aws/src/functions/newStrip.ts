/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-29 19:12:23 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-29 19:15:18
 */

"use strict"

// tslint:disable-next-line: no-require-imports no-var-requires
const vandium = require("vandium")
import { APIGatewayEvent } from "aws-lambda"
import { handlePost as newStrip } from "webcomics-reader-webservices"
import { Provider } from "../providers/dynamoDB"
const provider = new Provider()

// tslint:disable: no-unsafe-any
exports.httpHandler = vandium.api()
.protection()
.POST(handlePost)

// tslint:enable: no-unsafe-any
.onError( (err: Error) => {
	console.log("Error: " + err)
	return err
})

async function handlePost(event: APIGatewayEvent) {
	if (event.pathParameters === null || event.pathParameters === undefined) throw new Error("Invalid Parameters")
	try {
		const comicName = event.pathParameters.comicName
		// For some reason, @types/aws-lambda believes API Gateway events bodies are strings...
		const strip = event.body as unknown as object
		await newStrip(comicName, strip, provider)
		return { result: "Done" }
	} catch (error) {
		console.log("Error: ", error)
		throw new Error("Failed")
	}
}
