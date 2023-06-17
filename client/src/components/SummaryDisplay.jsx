import PropTypes from "prop-types";
import { MdError } from "react-icons/md";
import { TripleMaze } from "react-spinner-animated";
import "react-spinner-animated/dist/index.css";

const SummaryDisplay = ({ isLoading, errorMessage, summarizedData }) => {
	return (
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
	);
};

SummaryDisplay.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	errorMessage: PropTypes.string,
	summarizedData: PropTypes.string.isRequired,
};

export default SummaryDisplay;
