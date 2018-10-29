const AWS = require("aws-sdk");
const region = process.env.REGION;
AWS.config.region = region;
const dynamodDb = new AWS.DynamoDB.DocumentClient();

const provider = {
    post: (strip) => {
        const params = {
            TableName: "ComicStrips",
            Item: strip
        }
        return new Promise((resolve, reject) => {
            dynamodDb.put(params, (error, result) => {
                if (error) return reject(error);
                else return resolve(result);
            })
        });
    },
    getStripsFor: async (comicName) => {
        const params = {
            TableName: "ComicStrips",
            KeyConditionExpression: "comicName = :name",
            ExpressionAttributeValues: {
                ":name": comicName
            }
        }
        return new Promise((resolve, reject) => {
            dynamodDb.query(params, (error, data) => {
                console.log("Error: ", error);
                console.log("Result: ", data);
                if (error) return reject(error);
                else return resolve(data);
            })
        });
    },
    getLatestStripFor: async (comicName) => {
        const params = {
            TableName: "ComicStrips",
            KeyConditionExpression: "comicName = :name",
            ExpressionAttributeValues: {
                ":name": comicName
            },
            Limit: 1,
            ScanIndexForward: false
        };
        return new Promise((resolve, reject) => {
            dynamodDb.query(params, (error, data) => {
                console.log("Error: ", error);
                console.log("Result: ", data);
                if (error) return reject(error);
                else return resolve(data);
            })
        });
    }
}

module.exports = provider;