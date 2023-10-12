import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";

const {
  SALESFORCE_LOGIN_URL,
  SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET,
  _SALESFORCE_TOKEN,
} = process.env;

/**
 * generate code challenge and code verifier
 */
// Dependency: Node.js crypto module
// https://nodejs.org/api/crypto.html#crypto_crypto
function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
var code_verifier = base64URLEncode(crypto.randomBytes(32));

// Dependency: Node.js crypto module
// https://nodejs.org/api/crypto.html#crypto_crypto
function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}
var code_challenge = base64URLEncode(sha256(code_verifier));
/**
 * axios get request to retrieve code from url params
 */
let codeConfig = {
  method: "get",
  maxBodyLength: Infinity,
  url: `https://test.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9xfrbKQ6hBytByscaxk3UqZ4mFLvo0nP3U7oPIB4VO9rpgPuo6yp8zFkmAcJ9PUcjECjdGR72QS7DW2CL&redirect_uri=https://test.salesforce.com&code_challenge_method=S256&code_challenge=${code_challenge}&scope=refresh_token api`,
  headers: {
    Cookie:
      "BrowserId=Bda6AUedEe6auBt_rSvqKg; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1",
  },
  // data: data,
};

axios
  .request(codeConfig)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

/**
 * axios PUSH request to retrieve token
 */
let data = new FormData();
data.append("grant_type", "authorization_code");
data.append("code_verifier", "eyIxIjoyMCwiMiI6MTg5LCIzIjoxNDgsIjQiOjExM30");
data.append(
  "code",
  "aPrxIYzqQUQ4x9524VvwDJh9ZhciCJz0Rzd6BbLwlWb6C9FqFZ4ZyYbI.qdgpW7itzjFXNuJTw=="
);
data.append("client_id", SALESFORCE_CLIENT_ID);
data.append("client_secret", SALESFORCE_CLIENT_SECRET);
data.append("redirect_uri", "https://test.salesforce.com");
data.append("format", "json");

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://test.salesforce.com/services/oauth2/token",
  headers: {
    Cookie:
      "BrowserId=Bda6AUedEe6auBt_rSvqKg; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1",
    ...data.getHeaders(),
  },
  data: data,
};

export const getToken = () => {
  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};