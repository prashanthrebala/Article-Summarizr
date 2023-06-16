const express = require("express");
const router = express.Router();
const Summary = require("../mongodb/models/summary.js");

router.use(express.json());

router
	.route("/")
	.get((req, res) => {
		Summary.find()
			.limit(3)
			.then((summaries) => {
				res.json(summaries);
			})
			.catch((error) => {
				console.error("Failed to retrieve summaries:", error);
				res.status(500).json({ error: "Failed to retrieve summaries" });
			});
	})
	.post((req, res) => {
		const { name, urlLink, summary, serverApiKey } = req.body;

		if (serverApiKey !== process.env.SERVER_API_KEY) {
			return res.status(401).json({ error: "Invalid server credentials" });
		}

		const compressedArticle = new Summary({
			name: name || "Anonymous User",
			urlLink,
			summary,
			date: new Date(),
		});

		compressedArticle
			.save()
			.then((result) => {
				res.json(result);
			})
			.catch((error) => {
				console.error("Failed to save summary:", error);
				res.status(500).json({ error: "Failed to save summary" });
			});
	});

module.exports = router;
