import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const API = "http://localhost:8000/api";
// publicRuntimeConfig.PRODUCTION
// ? publicRuntimeConfig.API_PRODUCTION
// : publicRuntimeConfig.API_DEVELOPMENT;
export const APP_NAME = publicRuntimeConfig.APP_NAME;
