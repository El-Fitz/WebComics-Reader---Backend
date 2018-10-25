
const mod = require("../functions/newStrip");
const lambdaWrapper = require("serverless-jest-plugin").lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: "httpHandler" });

describe("Basic test", () => {
	const dummyAPIGatewayEvent = {
		pathParameters: {
			comicName: "XKCD"
		},
		body: {
			title: "Customer Rewards",
			url: "https://xkcd.com/2006/",
			content: "<img src=\"https://imgs.xkcd.com/comics/customer_rewards.png\" title=\"We'll pay you $1.47 to post on social media about our products, $2.05 to mention it in any group chats you're in, and 11 cents per passenger each time you drive your office carpool past one of our billboards.\" alt=\"We'll pay you $1.47 to post on social media about our products, $2.05 to mention it in any group chats you're in, and 11 cents per passenger each time you drive your office carpool past one of our billboards.\" />",
			image: "https://imgs.xkcd.com/comics/customer_rewards.png","published":"June 13, 2018 at 06:00AM"
		}
	}

	const result = wrapped.run(dummyAPIGatewayEvent);

	it("should return", () => {
		return expect(result).toBeDefined();
	});
});