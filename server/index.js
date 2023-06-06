const express = require("express");
const axios = require("axios");
const app = express();

require("dotenv").config();

const PORT_NUMBER = process.env.SERVER_PORT || 9000;

app.get("/summarize", async (req, res) => {
	const articleLink = req.query.articleLink;
	const numberOfParagraphs = req.query.numberOfParagraphs || 3;
	console.log(articleLink);

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
		const response = await axios.request(options);
		res.json(response.data);
	} catch (error) {
		console.error(error);
		res.sendStatus(503);
	}
});

app.listen(PORT_NUMBER, () => {
	console.log(`listening on port ${PORT_NUMBER}`);
});
