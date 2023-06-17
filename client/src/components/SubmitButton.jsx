import PropTypes from "prop-types";
import { IoSend } from "react-icons/io5";

const SubmitButton = ({ isLoading, handleSubmit }) => {
	return (
		<button
			type="button"
			disabled={isLoading}
			onClick={handleSubmit}
			className={`${
				isLoading ? "bg-slate-500" : "bg-green-700"
			} w-14 rounded-lg flex justify-center items-center`}
		>
			<IoSend size={24} />
		</button>
	);
};

SubmitButton.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

export default SubmitButton;
