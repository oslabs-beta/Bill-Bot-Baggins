import express from "express";
import { MongoClient } from "mongodb";
import salesforceController from "./salesforce-pub-sub-api.mjs";

const app = express();
app.use(express.json());

/**
 * open salesforce pub-sub API connection
 */
salesforceController();

app.listen(3030, () => console.log("server is listening on port 3030"));

const { MONGO_DB_PASS } = process.env;

// Connection URL
const url = `mongodb+srv://jayachankura:${MONGO_DB_PASS}@salesforcestripeesc.hhz7e4d.mongodb.net/?retryWrites=true&w=majority&appName=SalesforceStripeESC`;
const client = new MongoClient(url);

// Database Name
const dbName = "ESCdatabase";
let dbCollection;

async function main() {
  try {
    // Use connect method to connect to the server
    await client.connect();

    console.log("Connected successfully to database");

    const db = client.db(dbName);

    dbCollection = db.collection("documents");
  } catch (error) {
    console.error("unable to connect to db", error);
  }
}

main();

export { dbCollection };
