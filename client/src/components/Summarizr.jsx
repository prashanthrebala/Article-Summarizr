import { useRef, useState } from "react";
import { SUMMARIZR_BASE_URL } from "../config";
import { MdError } from "react-icons/md";
import { TripleMaze } from "react-spinner-animated";
import axios from "axios";
import background from "../assets/summarizr-bg.png";
import "react-spinner-animated/dist/index.css";

export const Summarizr = () => {
	const urlInputRef = useRef();
	const [summarizedData, setSummarizedData] = useState(
		"<p>Your summarized article will appear here...<p>"
	);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const handleKeyPress = async (event) => {
		if (event.key === "Enter") {
			event.target.blur();
			try {
				setIsLoading(true);
				setErrorMessage(null);
				const response = await axios.get(`${SUMMARIZR_BASE_URL}/summarize`, {
					params: {
						articleLink: urlInputRef.current.value,
					},
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = response.data;
				console.log("response received");
				setSummarizedData(data.summary.replace(/\n/g, "<br>"));
			} catch (error) {
				console.error("API error:", error);
				setErrorMessage("There was an error fetching your article");
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="flex items-center md:justify-center md:flex-row flex-col min-h-screen text-neutral-100 bg-gray-900">
			<div
				className="w-full md:w-1/2 flex items-center justify-center flex-col space-y-6 py-6 md:min-h-screen"
				style={{
					background: `url(${background})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div
					style={{
						fontFamily: "Passion One",
						fontWeight: "700",
						fontSize: "4em",
					}}
					className="text-5xl w-5/6 text-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]"
				>
					Article Summarizr
				</div>
				<input
					ref={urlInputRef}
					onKeyDown={handleKeyPress}
					className="w-5/6 rounded-lg p-2 outline-0 h-14 border-2 border-neutral-600 bg-slate-100 text-neutral-800"
					placeholder="Enter a URL here"
				/>
				<div className="w-5/6 text-sm text-justify md:text-center">
					{`This website uses a RapidAPI that extracts news/article body from a URL and uses GPT to summarize the article content.`}
				</div>
			</div>
			<div className="w-full md:w-1/2 text-center text-neutral-950 h-full md:min-h-screen flex justify-center items-center py-4 md:py-16">
				<div
					className={`w-11/12 md:w-5/6 text-slate-200 text-justify md:overflow-y-auto md:h-[80vh] outline outline-1 outline-gray-600 rounded-md p-2 md:p-8 ${
						isLoading || errorMessage ? "flex items-center justify-center" : ""
					}`}
				>
					{isLoading && (
						<TripleMaze
							text={
								"Please wait while we fetch the summarized article. This may take upto a minute"
							}
							center={false}
						/>
					)}
					{errorMessage && (
						<div className="flex flex-col space-y-4 items-center">
							<MdError size={70} />
							<div>{errorMessage}</div>
						</div>
					)}
					{!isLoading && !errorMessage && (
						<div
							className="p-4"
							dangerouslySetInnerHTML={{ __html: summarizedData }}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
