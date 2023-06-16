const mongoose = require("mongoose");

const connectToDB = async (mongoURL) => {
	await mongoose
		.connect(mongoURL)
		.then(() => console.log(`successful connection to MongoDB`))
		.catch((err) => {
			console.log(`failed to connect to MongoDB: ${err}`);
		});
};

module.exports = connectToDB;
