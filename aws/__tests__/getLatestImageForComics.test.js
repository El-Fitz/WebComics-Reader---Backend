
const AWS_SDK = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const sinon = require("sinon");

describe("Simple Successful GET Latest Images Test", () => {
	const dummyAPIGatewayEvent = {
		resource: '/latestImages',
		path: '/dev/latestImages',
		httpMethod: 'GET',
		headers: {
			'CloudFront-Forwarded-Proto': 'https',
			'CloudFront-Is-Desktop-Viewer': 'true',
			'CloudFront-Is-Mobile-Viewer': 'false',
			'CloudFront-Is-SmartTV-Viewer': 'false',
			'CloudFront-Is-Tablet-Viewer': 'false',
			'CloudFront-Viewer-Country': 'FR',
			Host: 'comics.parsiweb.fr',
			'User-Agent': 'Paw/3.1.7 (Macintosh; OS X/10.14.0) GCDHTTPRequest',
			Via: '1.1 15915c6842263dc42a906b5361d7d566.cloudfront.net (CloudFront)',
			'X-Amz-Cf-Id': 'BWbinuzcWAOC9u2VnQmm4qtn1aNImP3jXfj2iIdxo4pnZHlAy_n4Ig==',
			'X-Amzn-Trace-Id': 'Root=1-5bd315c6-fd645e0411edd4c49197ea5a',
			'X-Forwarded-For': '82.251.106.238, 54.239.156.97',
			'X-Forwarded-Port': '443',
			'X-Forwarded-Proto': 'https'
		},
		multiValueHeaders: {
			'CloudFront-Forwarded-Proto': ['https'],
			'CloudFront-Is-Desktop-Viewer': ['true'],
			'CloudFront-Is-Mobile-Viewer': ['false'],
			'CloudFront-Is-SmartTV-Viewer': ['false'],
			'CloudFront-Is-Tablet-Viewer': ['false'],
			'CloudFront-Viewer-Country': ['FR'],
			Host: ['comics.parsiweb.fr'],
			'User-Agent': ['Paw/3.1.7 (Macintosh; OS X/10.14.0) GCDHTTPRequest'],
			Via: ['1.1 15915c6842263dc42a906b5361d7d566.cloudfront.net (CloudFront)'],
			'X-Amz-Cf-Id': ['BWbinuzcWAOC9u2VnQmm4qtn1aNImP3jXfj2iIdxo4pnZHlAy_n4Ig=='],
			'X-Amzn-Trace-Id': ['Root=1-5bd315c6-fd645e0411edd4c49197ea5a'],
			'X-Forwarded-For': ['82.251.106.238, 54.239.156.97'],
			'X-Forwarded-Port': ['443'],
			'X-Forwarded-Proto': ['https']
		},
		queryStringParameters: {},
		multiValueQueryStringParameters: null,
		pathParameters: {},
		stageVariables: null,
		requestContext: {
			resourceId: 'uipxnn',
			resourcePath: '/latestImages',
			httpMethod: 'GET',
			extendedRequestId: 'PYBXAEUUjoEFfXw=',
			requestTime: '26/Oct/2018:13:25:26 +0000',
			path: '/dev/latestImages',
			accountId: '430891671017',
			protocol: 'HTTP/1.1',
			stage: 'dev',
			domainPrefix: 'comics',
			requestTimeEpoch: 1540560326414,
			requestId: '999d53c7-d922-11e8-bbe9-ad4679652ba7',
			identity: {
				cognitoIdentityPoolId: null,
				accountId: null,
				cognitoIdentityId: null,
				caller: null,
				sourceIp: '82.251.106.238',
				accessKey: null,
				cognitoAuthenticationType: null,
				cognitoAuthenticationProvider: null,
				userArn: null,
				userAgent: 'Paw/3.1.7 (Macintosh; OS X/10.14.0) GCDHTTPRequest',
				user: null
			},
			domainName: 'comics.parsiweb.fr',
			apiId: 'zogiyl9xth'
		},
		body: null,
		isBase64Encoded: false,
		cookies: {}
	};

	let stub;
	let result;
	let resultError;
	
	beforeAll(async () => {
		stub = sinon.stub().onFirstCall().callsFake((params, callback) => {
			const res = { Items:
				[ { content:
					 'We\'ll pay you $1.47 to post on social media about our products, $2.05 to mention it in any group chats you\'re in, and 11 cents per passenger each time you drive your office carpool past one of our billboards.',
					comicName: 'XKCD',
					url: 'https://xkcd.com/2006/',
					id: '2006',
					imgUrl: 'https://imgs.xkcd.com/comics/customer_rewards.png',
					publishedDate: 'June 13, 2018 at 06:00AM',
					title: 'Customer Rewards' } ],
			   Count: 1,
			   ScannedCount: 1,
			   LastEvaluatedKey: { id: '2006', comicName: 'XKCD' } }
			return callback(null, res);
		}).onSecondCall().callsFake((params, callback) => {
			const res = { Items:
				[ { comicName: 'QUESTIONNABLE_CONTENT',
					url: 'http://questionablecontent.net/view.php?comic=3851',
					id: '3851',
					imgUrl: 'http://www.questionablecontent.net/comics/3860.gif',
					publishedDate: 'October 26, 2018 at 03:16AM',
					title: 'Fair\'s Fair' } ],
			   Count: 1,
			   ScannedCount: 1 }
			   return callback(null, res);
		});
		AWS.setSDKInstance(AWS_SDK);
		AWS.mock("DynamoDB.DocumentClient", "query", stub)
		process.env.REGION = "eu-west-1";
		
		const mod = require("../functions/getLastImageForComics");
		const lambdaWrapper = require("serverless-jest-plugin").lambdaWrapper;
		const wrapped = lambdaWrapper.wrap(mod, { handler: "httpHandler" });
		try {
			result = await wrapped.run(dummyAPIGatewayEvent);
		} catch (error) {
			resultError = error;
		}
		AWS.restore("DynamoDB.DocumentClient");
	});

	const expectedResult = {
		"body": "[{\"comicName\":\"XKCD\",\"id\":\"2006\",\"publishedDate\":\"June 13, 2018 at 06:00AM\",\"imgUrl\":\"https://imgs.xkcd.com/comics/customer_rewards.png\"},{\"comicName\":\"QUESTIONNABLE_CONTENT\",\"id\":\"3851\",\"publishedDate\":\"October 26, 2018 at 03:16AM\",\"imgUrl\":\"http://www.questionablecontent.net/comics/3860.gif\"}]",
		"headers": {},
		"isBase64Encoded": false,
		"statusCode": 200
	};

	it("should return", () => {
		return expect(result).toBeDefined();
	});

	it("should not fail", () => {
		return expect(resultError).toBeUndefined();
	});

	it("should have called the spy twice", () => {
		return expect(stub.callCount).toEqual(2);
	});
	
	it("should return the expected result", () => {
		return expect(result).toEqual(expectedResult);
	});
});