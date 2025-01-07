import InitiateSocialAuth from "./initiateSocialAuth";

export { default as extractErrorMessage } from "./extractErrorMessage";
export { default as persistAuth } from "./persistAuth";

export const UseGoogleAuth = () =>
  InitiateSocialAuth("google-oauth2", "google");

export { formatDate } from "./formatDate";
export { capitalizeFirstLetter } from "./capitalizeFirstLetter";
