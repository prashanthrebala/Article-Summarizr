const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const { dummyData } = require("./dummyData");

require("dotenv").config();

const DEBUG_MODE = process.env.ENVIRONMENT === "development";
const PORT_NUMBER = process.env.SERVER_PORT || 9000;

app.use(
	cors({
		origin: process.env.CLIENT_SITE_URL,
	})
);

app.get("/summarize", async (req, res) => {
	const articleLink = req.query.articleLink;
	const numberOfParagraphs = req.query.numberOfParagraphs || 3;
	console.log(`request received for ${articleLink}`);

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
		console.log("api fetch succeeded");
		res.json(response.data);
	} catch (error) {
		console.error(error);
		if (error.response) {
			res.status(error.response.status).json({
				error: error.response.data,
			});
		} else if (error.request) {
			res.sendStatus(503);
		} else {
			res.status(500).json({
				error: "Internal Server Error",
			});
		}
	}
});

app.listen(PORT_NUMBER, () => {
	console.log(`Starting Summarizr server in ${process.env.ENVIRONMENT} mode`);
	console.log(`listening on port ${PORT_NUMBER}`);
});
