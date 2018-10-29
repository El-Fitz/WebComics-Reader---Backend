"use strict"

// tslint:disable-next-line: no-require-imports no-var-requires
const vandium = require("vandium")
import { APIGatewayEvent } from "aws-lambda"
import { Provider } from "../providers/dynamoDB"
const provider = new Provider()

// tslint:disable-next-line: no-unsafe-any
exports.httpHandler = vandium.api()
	.protection()
	.GET(handleGet)

async function handleGet(event: APIGatewayEvent) {
	if (event.pathParameters === null || event.pathParameters === undefined) throw new Error("Invalid Parameters")
	const comicName = event.pathParameters.comicName
	const results = await provider.getStripsFor(comicName)
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 7);
	return {
		isBase64Encoded: false, // Set to `true` for binary support.
		statusCode: 200,
		headers: {
			"Cache-Control": "max-age=86400, public",
		},
		body: results.reverse(),
	}
}
