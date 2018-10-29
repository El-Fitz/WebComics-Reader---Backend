import { DynamoDB } from "aws-sdk"
import { Comic, ComicsProvider } from "webcomics-reader-webservices"
const region = process.env.REGION
const dynamodDb = new DynamoDB.DocumentClient({ region: region })

interface DynamoDBComic {
	[keyof: string]: string
}

export class Provider implements ComicsProvider {
	public post = (strip: Comic) => {
		const params = {
			TableName: "ComicStrips",
			Item: strip,
		}
		return dynamodDb.put(params)
			.promise()
			.then(() => { return })
	}

	public getStripsFor = (comicName: string) => {
		const params = {
			TableName: "ComicStrips",
			KeyConditionExpression: "comicName = :name",
			ExpressionAttributeValues: {
				":name": comicName,
			},
		}
		return dynamodDb.query(params)
			.promise()
			.then((data) => {
				console.log("Result: ", data)
				if (data === undefined || data.Items === undefined || data.Items.length <= 0) throw new Error("No items")
				return data.Items.map((item: DynamoDBComic) => new Comic(item.comicName, item.id, item.title, item.imgUrl, item.url, item.content, item.publishedData))
			})
	}

	public getLatestStripFor = (comicName: string) => {
		const params = {
			TableName: "ComicStrips",
			KeyConditionExpression: "comicName = :name",
			ExpressionAttributeValues: {
				":name": comicName,
			},
			Limit: 1,
			ScanIndexForward: false,
		}
		return dynamodDb.query(params)
			.promise()
			.then((data) => {
				console.log("Result: ", data)
				if (data === undefined || data.Items === undefined || data.Items.length <= 0) throw new Error("No items")
				const item = data.Items[0] as DynamoDBComic
				return new Comic(item.comicName, item.id, item.title, item.imgUrl, item.url, item.content, item.publishedDate)
			})
	}
}
