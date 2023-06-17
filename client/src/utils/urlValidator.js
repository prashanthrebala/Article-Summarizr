const isValidWebsite = (str) => {
	const websiteRegex =
		/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
	return websiteRegex.test(str);
};

export default isValidWebsite;
