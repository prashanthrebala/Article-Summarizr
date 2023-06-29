import axios from "axios";
import { SUMMARIZR_BASE_URL } from "../config";

export const fetchSummarizedData = async (articleLink) => {
	try {
		const response = await axios.get(`${SUMMARIZR_BASE_URL}/summarize`, {
			params: {
				articleLink,
			},
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = response.data;
		return data.summary.replace(/\n/g, "<br>");
	} catch (error) {
		console.error("API error:", error);
		if (error.response?.status === 429) {
			throw new Error(error.response.data.error);
		}
		throw new Error("There was an error fetching your article");
	}
};
