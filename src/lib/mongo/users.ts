import type { Db, Collection, MongoClient } from "mongodb";
import clientPromise from ".";

interface User {
	_id: string;
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
		db = client.db(process.env.DB_NAME);
		users =  db.collection(process.env.USERS_COLLECTION_NAME as string);
	} catch (error) {
		throw new Error('Failed to connect to database');
	}
};

init()
.catch(console.error);


export const getUsers = async () => {
	try {
		if (!users) await init();
		const result = await users
		.find({})
		.map(user => ({ ...user, _id: user._id.toString() }))
		.toArray() as User[];

		return { users: result };
	} catch (error) {
		console.error(error);
		return { error: 'Failed to fetch users' };
	}
}
