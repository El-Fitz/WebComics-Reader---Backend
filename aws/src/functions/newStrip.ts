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
	.POST({
			body: {
				title: vandium.types.string().required(),
				url: vandium.types.string().required(),
				content: vandium.types.string().required(),
				image: vandium.types.string().min(20).required(),
				published: vandium.types.string().required(),
			},
		},
		handlePost,
	)
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
