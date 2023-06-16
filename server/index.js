const connectToDB = require("./mongodb/connect.js");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const { dummyData } = require("./dummyData");
const summariesRouter = require("./routes/summaries.js");
const {
	ALLOWED_ORIGIN,
	DEV_MODE,
	ENVIRONMENT,
	MONGO_URL,
	RAPID_API_BASE_URL,
	RAPID_API_KEY,
	RAPID_API_HOST,
	SERVER_API_KEY,
	SERVER_PORT,
} = require("./config.js");

app.use("/summaries", summariesRouter);
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use((req, res, next) => {
	console.log("Allowed origins", ALLOWED_ORIGIN);
	console.log("Request origin", req.headers.origin);
	if (req.headers.origin !== ALLOWED_ORIGIN) {
		return res.status(403).json({ error: "Forbidden" });
	}
	next();
});

app.get("/summarize", async (req, res) => {
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

app.listen(SERVER_PORT, () => {
	try {
		connectToDB(MONGO_URL);
		console.log(`Starting Summarizr server in ${ENVIRONMENT} mode`);
		console.log(`Listening on port ${SERVER_PORT}`);
	} catch (error) {
		console.log(`error starting the server: ${error}`);
	}
});
