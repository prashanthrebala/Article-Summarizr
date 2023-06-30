require("dotenv").config();

const DEV_MODE = process.env.ENVIRONMENT === "development";

module.exports = {
	ALLOWED_ORIGIN: DEV_MODE
		? process.env.LOCAL_CLIENT_SITE_URL
		: process.env.PROD_CLIENT_SITE_URL,
	DEV_MODE,
	ENVIRONMENT: process.env.ENVIRONMENT,
	MONGO_URL: DEV_MODE ? process.env.MONGO_DEV_URL : process.env.MONGO_PROD_URL,
	RAPID_API_BASE_URL: process.env.RAPID_API_BASE_URL,
	RAPID_API_HOST: process.env.RAPID_API_HOST,
	RAPID_API_KEY: process.env.RAPID_API_KEY,
	SERVER_API_KEY: process.env.SERVER_API_KEY,
	SERVER_PORT: process.env.SERVER_PORT || 9000,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
};
