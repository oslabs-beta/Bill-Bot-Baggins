// import * as sfToken
require("dotenv").config();
const { getToken } = require("sf-jwt-token");

const getSalesForceAccessToken = async () => {
  // convert the base64 private key into a string
  const {
    BASE64_PRIVATE_KEY,
    SALESFORCE_CLIENT_ID,
    SALESFORCE_USERNAME,
    SALESFORCE_TEST_URL,
  } = process.env;

  const privateKey = Buffer.from(BASE64_PRIVATE_KEY, "base64").toString(
    "utf-8",
  );

  try {
    // gets a new (if it hasn't expired it will send the still active token) access token from sales force
    const jwtTokenResponse = await getToken({
      iss: SALESFORCE_CLIENT_ID,
      sub: SALESFORCE_USERNAME,
      aud: SALESFORCE_TEST_URL,
      privateKey: privateKey,
    });

    return jwtTokenResponse.access_token;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching token:", error);
    }
    throw Error;
  }
};

module.exports = { getSalesForceAccessToken };
