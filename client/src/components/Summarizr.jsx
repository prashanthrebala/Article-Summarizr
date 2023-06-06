import { useRef, useState } from "react";

export const Summarizr = () => {
	const urlInputRef = useRef();
	const [summarizedData, setSummarizedData] = useState("");
	const handleKeyPress = async (event) => {
		if (event.key === "Enter") {
			// const url = urlInputRef.current.value;
			try {
				const response = await fetch("http://192.168.1.129:5012/summarize", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				console.log("API response:", data);
				// response.summary.replace(/\n/g, "<br>")
				setSummarizedData(data.summary.replace(/\n/g, "<br>"));
			} catch (error) {
				console.error("API error:", error);
			}
		}
	};

	return (
		<div className="flex items-center md:justify-center justify-around md:flex-row flex-col min-h-screen">
			<div className="w-full md:w-1/2 flex items-center justify-center flex-col space-y-6">
				<div className="text-5xl">Text Summarizr</div>
				<input
					ref={urlInputRef}
					onKeyDown={handleKeyPress}
					className="w-5/6 rounded-lg p-2 outline-0 h-10 border-2 border-amber-500 bg-slate-100"
					placeholder="Enter a URL here"
				/>
			</div>
			<div className="w-full md:w-1/2 text-center md:min-h-screen bg-amber-500 flex justify-center md:py-24">
				<div
					className="bg-red-500 w-5/6 text-justify"
					dangerouslySetInnerHTML={{ __html: summarizedData }}
				></div>
			</div>
		</div>
	);
};
