
const AWS_SDK = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const sinon = require("sinon");

describe("Simple Successful GET Strips Test", () => {
	const dummyAPIGatewayEvent = {
		resource: '/{comicName}',
		path: '/dev/QUESTIONNABLE_CONTENT',
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
			Via: '1.1 fffec0bd5fe752e118ffb0f18477eedd.cloudfront.net (CloudFront)',
			'X-Amz-Cf-Id': 'CEoVC2w2VtdvaLg1r9Xm7usrLclWQnbVOQixA9X71yZw5cyW5LtW1Q==',
			'X-Amzn-Trace-Id': 'Root=1-5bd3143b-4e9f1de6d9f87da4a9bcb737',
			'X-Forwarded-For': '82.251.106.238, 54.239.156.70',
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
			Via: ['1.1 fffec0bd5fe752e118ffb0f18477eedd.cloudfront.net (CloudFront)'],
			'X-Amz-Cf-Id': ['CEoVC2w2VtdvaLg1r9Xm7usrLclWQnbVOQixA9X71yZw5cyW5LtW1Q=='],
			'X-Amzn-Trace-Id': ['Root=1-5bd3143b-4e9f1de6d9f87da4a9bcb737'],
			'X-Forwarded-For': ['82.251.106.238, 54.239.156.70'],
			'X-Forwarded-Port': ['443'],
			'X-Forwarded-Proto': ['https']
		},
		queryStringParameters: {},
		multiValueQueryStringParameters: null,
		pathParameters: {
			comicName: 'QUESTIONNABLE_CONTENT'
		},
		stageVariables: null,
		requestContext: {
			resourceId: 'wi0l0s',
			resourcePath: '/{comicName}',
			httpMethod: 'GET',
			extendedRequestId: 'PYAZUE7ejoEFW0A=',
			requestTime: '26/Oct/2018:13:18:51 +0000',
			path: '/dev/QUESTIONNABLE_CONTENT',
			accountId: '430891671017',
			protocol: 'HTTP/1.1',
			stage: 'dev',
			domainPrefix: 'comics',
			requestTimeEpoch: 1540559931684,
			requestId: 'ae564f38-d921-11e8-abf5-213c87935989',
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
		stub = sinon.stub().callsFake((params, callback) => {
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
		
		const mod = require("../functions/getStrips");
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
		"body": "[{\"comicName\":\"QUESTIONNABLE_CONTENT\",\"url\":\"http://questionablecontent.net/view.php?comic=3851\",\"id\":\"3851\",\"imgUrl\":\"http://www.questionablecontent.net/comics/3860.gif\",\"publishedDate\":\"October 26, 2018 at 03:16AM\",\"title\":\"Fair's Fair\"}]",
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

	it("should have called the spy once", () => {
		return expect(stub.callCount).toEqual(1);
	});
	
	it("should return the expected result", () => {
		return expect(result).toEqual(expectedResult);
	});
});