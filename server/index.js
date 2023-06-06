const express = require("express");
const app = express();

require("dotenv").config();

const PORT_NUMBER = process.env.SERVER_PORT || 9000;

app.listen(PORT_NUMBER, () => {
	console.log(`listening on port ${PORT_NUMBER}`);
});
