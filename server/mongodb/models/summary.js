const { DEFAULT_USERNAME } = require("../constants");
const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
	name: { type: String, default: DEFAULT_USERNAME },
	urlLink: { type: String, required: true },
	summary: { type: String, required: true },
	date: { type: Date, required: true },
});

const Summary = mongoose.model("Summary", summarySchema);

module.exports = Summary;
