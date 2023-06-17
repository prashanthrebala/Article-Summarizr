import PropTypes from "prop-types";

const UrlInput = ({ inputElementRef, onKeyDown }) => {
	return (
		<input
			ref={inputElementRef}
			onKeyDown={onKeyDown}
			className="w-5/6 rounded-lg p-2 outline-0 h-12 md:h-14 border-2 border-neutral-600 bg-slate-100 text-neutral-800"
			placeholder="Enter a URL here"
		/>
	);
};

UrlInput.propTypes = {
	inputElementRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]),
	onKeyDown: PropTypes.func,
};

export default UrlInput;
