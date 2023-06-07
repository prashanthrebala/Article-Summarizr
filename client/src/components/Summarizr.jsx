import { useRef, useState } from "react";
import { SUMMARIZR_BASE_URL } from "../constants/constants";
import { TripleMaze } from "react-spinner-animated";
import axios from "axios";
import background from "../assets/haikei-blob.png";
import "react-spinner-animated/dist/index.css";

export const Summarizr = () => {
	const urlInputRef = useRef();
	const [summarizedData, setSummarizedData] = useState(
		"<p>Your summarized article will appear here...<p>"
	);
	const [isLoading, setIsLoading] = useState(false);
	const handleKeyPress = async (event) => {
		if (event.key === "Enter") {
			try {
				setIsLoading(true);
				const response = await axios.get(`${SUMMARIZR_BASE_URL}/summarize`, {
					params: {
						articleLink: urlInputRef.current.value,
					},
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = response.data;
				console.log("API response:", response.data);
				setIsLoading(false);
				setSummarizedData(data.summary.replace(/\n/g, "<br>"));
			} catch (error) {
				console.error("API error:", error);
			}
		}
	};

	return (
		<div
			className="flex items-center md:justify-center md:flex-row flex-col min-h-screen text-neutral-100"
			style={{
				background: `url(${background})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="w-full md:w-1/2 flex items-center justify-center flex-col space-y-6 my-6">
				<div
					style={{
						fontFamily: "Passion One",
						fontWeight: "700",
						fontSize: "4em",
					}}
					className="text-5xl w-5/6 text-center"
				>
					Article Summarizr
				</div>
				<input
					ref={urlInputRef}
					onKeyDown={handleKeyPress}
					className="w-5/6 rounded-lg p-2 outline-0 h-14 border-2 border-green-600 bg-slate-100 text-neutral-800"
					placeholder="Enter a URL here"
				/>
				<div className="w-5/6 text-sm text-center">
					{`This is a website that uses a RapidAPI that extracts news/article body from a URL and uses GPT to summarize the article content.`}
				</div>
			</div>
			<div className="w-full md:w-1/2 text-center h-full md:min-h-screen flex justify-center items-center py-4 md:py-16">
				<div
					className={`w-11/12 md:w-5/6 text-justify md:overflow-y-auto md:h-[80vh] bg-green-900 rounded-md p-2 md:p-8 ${
						isLoading ? "flex items-center" : ""
					}`}
				>
					{isLoading ? (
						<TripleMaze
							text={
								"Please wait while we fetch the summarized article. This may take upto a minute"
							}
							center={false}
						/>
					) : (
						<div dangerouslySetInnerHTML={{ __html: summarizedData }} />
					)}
				</div>
			</div>
		</div>
	);
};
