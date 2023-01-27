import type { Db, Collection, MongoClient, ObjectId } from "mongodb";
import { ObjectId as OI } from "mongodb";
import clientPromise from ".";

interface User {
	_id: ObjectId;
	email: string;
	username: string;
	password: string;
	artPrompts: {
		_id: string;
		prompt:	string;
		images: string[];
		project: string;
	}[];
	chatPrompts: {
		_id: string;
		records: {
			prompt: string;
			response: string;
		}[];
		project: string;
	}[];
	projects: {
		_id: string;
		name: string;
		art: string[];
		chat: string[];
	}[]
}

let client: MongoClient;
let db: Db;
let users: Collection<User>;

const init = async () => {
	if (db) return;
	try {
		client = await clientPromise;
		console.log(client);
		db = client.db(process.env.DB_NAME);
		users =  db.collection(process.env.USERS_COLLECTION_NAME as string);
	} catch (error) {
		throw new Error('Failed to connect to database');
	}
};

init()
.then(value => console.log(value))
.catch(console.error);


export const getUser = async () => {
	try {
		if (!users) await init();
		const result = await users
		.find({ _id: new OI("63d28074cb6e66aebb69395e") })
		.toArray() as User[];

		return { user: result };
	} catch (error) {
		console.error(error);
		return { error: 'Failed to fetch user' };
	}
}
