const env = import.meta.env;

export const SUMMARIZR_BASE_URL = env.DEV
	? env.VITE_LOCAL_SERVER_BASE_URL
	: env.VITE_PROD_SERVER_BASE_URL;
