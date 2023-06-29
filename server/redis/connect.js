const { createClient } = require("redis");

const connectToRedis = async () => {
	const redisClient = createClient();
	await redisClient
		.connect()
		.then(() => console.log(`successful connection to redis`))
		.catch((err) => console.log(`failed to connect to redis: ${err}`));
	return redisClient;
};

module.exports = connectToRedis;
