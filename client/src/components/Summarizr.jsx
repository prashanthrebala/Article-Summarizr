import { useState } from "react";
import Hero from "./Hero";
import SummaryDisplay from "./SummaryDisplay";

export const Summarizr = () => {
	const [summarizedData, setSummarizedData] = useState(
		"<p>Your summarized article will appear here...<p>"
	);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	return (
		<div className="flex items-center md:justify-center md:flex-row flex-col min-h-screen text-neutral-100 bg-gray-900">
			<Hero
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				setErrorMessage={setErrorMessage}
				setSummarizedData={setSummarizedData}
			/>
			<SummaryDisplay
				isLoading={isLoading}
				errorMessage={errorMessage}
				summarizedData={summarizedData}
			/>
		</div>
	);
};
