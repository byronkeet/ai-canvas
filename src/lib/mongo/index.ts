import { MongoClient } from 'mongodb';
import type * as mongoDB from "mongodb";

const URI = process.env.DB_CONN_STRING;
const options = {};

if (!URI) throw new Error('DB_CONN_STRING is not defined');

const client: mongoDB.MongoClient = new MongoClient(URI, options);
let clientPromise: Promise<mongoDB.MongoClient>;

const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<mongoDB.MongoClient>
  }

if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	if (!globalWithMongo._mongoClientPromise) {
		globalWithMongo._mongoClientPromise = client.connect();
	}

	clientPromise = globalWithMongo._mongoClientPromise;
} else {
	clientPromise = client.connect();
}

// const clientPromise = client.connect();

export default clientPromise;