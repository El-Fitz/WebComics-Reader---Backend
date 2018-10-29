
const AWS_SDK = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const sinon = require("sinon");

describe("Simple Successful POST Test", () => {
	const dummyAPIGatewayEvent = { 
		resource: '/{comicName}',
		path: '/dev/QUESTIONNABLE_CONTENT',
		httpMethod: 'POST',
		headers: { 
			'CloudFront-Forwarded-Proto': 'https',
			'CloudFront-Is-Desktop-Viewer': 'true',
			'CloudFront-Is-Mobile-Viewer': 'false',
			'CloudFront-Is-SmartTV-Viewer': 'false',
			'CloudFront-Is-Tablet-Viewer': 'false',
			'CloudFront-Viewer-Country': 'FR',
			'Content-Type': 'application/json; charset=utf-8',
			Host: 'comics.parsiweb.fr',
			'User-Agent': 'Paw/3.1.7 (Macintosh; OS X/10.14.0) GCDHTTPRequest',
			Via: '1.1 563853117b767ad5935282f751c56195.cloudfront.net (CloudFront)',
			'X-Amz-Cf-Id': 'jLF6YDMSdBw-zZJsmuxH_OoQI2sG6C68-xTXbB0qaHhlfE1niLiXow==',
			'X-Amzn-Trace-Id': 'Root=1-5bd2d9f0-a7c380b803efefaac5ec6f5a',
			'X-Forwarded-For': '82.251.106.238, 54.239.156.88',
			'X-Forwarded-Port': '443',
			'X-Forwarded-Proto': 'https' 
		},
		multiValueHeaders: {
			'CloudFront-Forwarded-Proto': [ 'https' ],
			'CloudFront-Is-Desktop-Viewer': [ 'true' ],
			'CloudFront-Is-Mobile-Viewer': [ 'false' ],
			'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
			'CloudFront-Is-Tablet-Viewer': [ 'false' ],
			'CloudFront-Viewer-Country': [ 'FR' ],
			'Content-Type': [ 'application/json; charset=utf-8' ],
			Host: [ 'comics.parsiweb.fr' ],
			'User-Agent': [ 'Paw/3.1.7 (Macintosh; OS X/10.14.0) GCDHTTPRequest' ],
			Via: [ '1.1 563853117b767ad5935282f751c56195.cloudfront.net (CloudFront)'],
			'X-Amz-Cf-Id': [ 'jLF6YDMSdBw-zZJsmuxH_OoQI2sG6C68-xTXbB0qaHhlfE1niLiXow==' ],
			'X-Amzn-Trace-Id': [ 'Root=1-5bd2d9f0-a7c380b803efefaac5ec6f5a' ],
			'X-Forwarded-For': [ '82.251.106.238, 54.239.156.88' ],
			'X-Forwarded-Port': [ '443' ],
			'X-Forwarded-Proto': [ 'https' ]
		},
		queryStringParameters: {},
		multiValueQueryStringParameters: null,
		pathParameters: {
			comicName: 'QUESTIONNABLE_CONTENT'
		},
		stageVariables: null,
		requestContext: 
		{ resourceId: 'wi0l0s',
		resourcePath: '/{comicName}',
		httpMethod: 'POST',
		extendedRequestId: 'PXb9gEOBDoEF9MQ=',
		requestTime: '26/Oct/2018:09:10:08 +0000',
		path: '/dev/QUESTIONNABLE_CONTENT',
		accountId: '430891671017',
		protocol: 'HTTP/1.1',
		stage: 'dev',
		domainPrefix: 'comics',
		requestTimeEpoch: 1540545008045,
		requestId: 'ef27b676-d8fe-11e8-a578-0f30e6502bfe',
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
			user: null },
			domainName: 'comics.parsiweb.fr',
			apiId: 'zogiyl9xth'
		},
		body: { 
			title: 'Fair\'s Fair',
			url: 'http://questionablecontent.net/view.php?comic=3851',
			content: '<img src="http://www.questionablecontent.net/comics/3860.gif">',
			image: 'http://www.questionablecontent.net/comics/3860.gif',
			published: 'October 26, 2018 at 03:16AM' 
		},
		isBase64Encoded: false,
		rawBody: '{"title":"Fair\'s Fair","url":"http://questionablecontent.net/view.php?comic=3851","content":"<img src=\\"http://www.questionablecontent.net/comics/3860.gif\\">","image":"http://www.questionablecontent.net/comics/3860.gif","published":"October 26, 2018 at 03:16AM"}',
		cookies: {} 
	}

	let stub;
	let result;
	let resultError;
	
	beforeAll(async () => {
		stub = sinon.stub().callsFake((params, callback) => {
			return callback(null, {});
		});
		AWS.setSDKInstance(AWS_SDK);
		AWS.mock("DynamoDB.DocumentClient", "put", stub)
		process.env.REGION = "eu-west-1";
		
		const mod = require("../build/functions/newStrip");
		const lambdaWrapper = require("serverless-jest-plugin").lambdaWrapper;
		const wrapped = lambdaWrapper.wrap(mod, { handler: "httpHandler" });
		try {
			result = await wrapped.run(dummyAPIGatewayEvent);
		} catch (error) {
			resultError = error;
		}
		AWS.restore("DynamoDB.DocumentClient");
	});

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
		return expect(result).toEqual({"body": "{\"result\":\"Done\"}", "headers": {}, "isBase64Encoded": false, "statusCode": 201});
	});
});