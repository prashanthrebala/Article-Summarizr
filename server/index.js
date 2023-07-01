const connectToDB = require("./mongodb/connect.js");
const { createClient } = require("redis");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const {
	ALLOWED_ORIGINS,
	DEV_MODE,
	ENVIRONMENT,
	MONGO_URL,
	RAPID_API_BASE_URL,
	RAPID_API_KEY,
	RAPID_API_HOST,
	SERVER_API_KEY,
	SERVER_PORT,
	REDIS_HOST,
	REDIS_PORT,
} = require("./config.js");

const app = express();
const redisClient = createClient({
	socket: {
		host: REDIS_HOST,
		port: REDIS_PORT,
	},
});
const { dummyData } = require("./dummyData");
const summariesRouter = require("./routes/summaries.js");

const getTimeTillEOD = function () {
	const now = new Date();
	const endOfDay = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + 1
	);
	return Math.floor((endOfDay - now) / 1000);
};

app.use("/summaries", summariesRouter);
app.use(cors({ origin: ALLOWED_ORIGINS }));

app.use(async (req, res, next) => {
	console.log("Request origin", req.headers.origin);
	if (!ALLOWED_ORIGINS.includes(req.headers.origin)) {
		return res.status(403).json({ error: "Forbidden" });
	}
	next();
});

app.use(async (req, res, next) => {
	try {
		const clientIP = req.socket.remoteAddress;
		const countOfTheDay = "countOfTheDay";
		const value = await redisClient.get(clientIP);
		const today = await redisClient.get(countOfTheDay);
		const count = value !== null ? parseInt(value) : 0;
		const todayCount = today !== null ? parseInt(today) : 0;
		if (count >= 2 || todayCount >= 3) {
			return res.status(429).json({
				error:
					"Too Many Requests. Since this is a free version, \
					this API is limited to 2 requests per IP address and \
					3 requests per day overall. Please try again tomorrow!",
			});
		}
		redisClient.setEx(clientIP, getTimeTillEOD(), (count + 1).toString());
		redisClient.setEx(
			countOfTheDay,
			getTimeTillEOD(),
			(todayCount + 1).toString()
		);
		next();
	} catch (error) {
		console.error("Error checking key existence in Redis:", error);
		next(error);
	}
});

app.use((err, req, res, next) => {
	console.error("Error occurred:", err);
	res.status(500).json({ error: "Internal Server Error" });
});

app.get("/summarize", async (req, res, next) => {
	const articleLink = req.query.articleLink;
	const numberOfParagraphs = req.query.numberOfParagraphs || 3;
	console.log(`Request received for ${articleLink}`);

	const options = {
		method: "GET",
		url: `${RAPID_API_BASE_URL}/summarize`,
		params: {
			url: articleLink,
			length: numberOfParagraphs,
		},
		headers: {
			"X-RapidAPI-Key": RAPID_API_KEY,
			"X-RapidAPI-Host": RAPID_API_HOST,
		},
	};

	try {
		const response = DEV_MODE ? dummyData : await axios.request(options);
		console.log("API fetch succeeded");

		const updateSummaryListOptions = {
			method: "POST",
			url: `http://localhost:${SERVER_PORT}/summaries`,
			data: {
				urlLink: articleLink,
				summary: response.data.summary,
				serverApiKey: SERVER_API_KEY,
			},
		};

		axios.request(updateSummaryListOptions); // Send the POST request asynchronously

		res.json(response.data);
	} catch (error) {
		console.error(error);
		if (error.response) {
			res.status(error.response.status).json({ error: error.response.data });
		} else if (error.request) {
			res.sendStatus(503);
		} else {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

app.use((err, req, res, next) => {
	console.error("Error occurred:", err);
	res.status(500).json({ error: "Internal Server Error" });
});

app.listen(SERVER_PORT, async () => {
	try {
		await connectToDB(MONGO_URL);
		await redisClient.connect();
		console.log(`Starting Summarizr server in ${ENVIRONMENT} mode`);
		console.log(`Listening on port ${SERVER_PORT}`);
	} catch (error) {
		console.log(`error starting the server: ${error}`);
	}
});
