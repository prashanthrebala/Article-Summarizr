const connectToDB = require("./mongodb/connect.js");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const { dummyData } = require("./dummyData");

require("dotenv").config();
const summariesRouter = require("./routes/summaries.js");

const DEBUG_MODE = process.env.ENVIRONMENT === "development";
const PORT_NUMBER = process.env.SERVER_PORT || 9000;
const allowedOrigin = process.env.CLIENT_SITE_URL;

app.use("/summaries", summariesRouter);
app.use(cors({ origin: allowedOrigin }));
app.use((req, res, next) => {
	console.log("Allowed origins", allowedOrigin);
	console.log("Request origin", req.headers.origin);
	if (req.headers.origin !== allowedOrigin && !DEBUG_MODE) {
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
		url: `${process.env.RAPID_API_URL}/summarize`,
		params: {
			url: articleLink,
			length: numberOfParagraphs,
		},
		headers: {
			"X-RapidAPI-Key": process.env.RAPID_API_KEY,
			"X-RapidAPI-Host": process.env.RAPID_API_HOST,
		},
	};

	try {
		const response = DEBUG_MODE ? dummyData : await axios.request(options);
		console.log("API fetch succeeded");

		const updateSummaryListOptions = {
			method: "POST",
			url: `http://localhost:${PORT_NUMBER}/summaries`,
			data: {
				urlLink: articleLink,
				summary: response.data.summary,
				serverApiKey: process.env.SERVER_API_KEY,
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

app.listen(PORT_NUMBER, () => {
	try {
		connectToDB(process.env.MONGO_URL);
		console.log(`Starting Summarizr server in ${process.env.ENVIRONMENT} mode`);
		console.log(`Listening on port ${PORT_NUMBER}`);
	} catch (error) {
		console.log(`error starting the server: ${error}`);
	}
});
