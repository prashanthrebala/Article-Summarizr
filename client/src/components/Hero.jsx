import { useRef } from "react";
import PropTypes from "prop-types";
import background from "../assets/summarizr-bg.png";
import isValidWebsite from "../utils/urlValidator";
import { fetchSummarizedData } from "../api/summarizrApi";
import UrlInput from "./URLInput";
import SubmitButton from "./SubmitButton";

const Hero = ({
	isLoading,
	setIsLoading,
	setErrorMessage,
	setSummarizedData,
}) => {
	const urlInputRef = useRef();

	const handleSubmit = async () => {
		const articleLink = urlInputRef.current?.value;
		if (!isValidWebsite(articleLink)) {
			alert("Enter a valid URL!");
			return;
		}

		try {
			setIsLoading(true);
			setErrorMessage(null);
			const summarizedData = await fetchSummarizedData(articleLink);
			setSummarizedData(summarizedData);
		} catch (error) {
			console.error("Error:", error);
			setErrorMessage(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = async (event) => {
		if (event.key === "Enter") {
			handleSubmit();
			event.target.blur();
		}
	};

	return (
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
			<div className="w-5/6 flex justify-center gap-x-1">
				<UrlInput inputElementRef={urlInputRef} onKeyDown={handleKeyPress} />
				<SubmitButton isLoading={isLoading} handleSubmit={handleSubmit} />
			</div>
			<div className="w-5/6 text-sm text-justify md:text-center">
				{`This website uses a RapidAPI that extracts news/article body from a URL and uses GPT to summarize the article content.`}
			</div>
		</div>
	);
};

Hero.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	setErrorMessage: PropTypes.func.isRequired,
	setSummarizedData: PropTypes.func.isRequired,
};

export default Hero;
