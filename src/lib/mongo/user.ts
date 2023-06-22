import type { Db, Collection, MongoClient, ObjectId } from "mongodb";
import { ObjectId as OI } from "mongodb";
import clientPromise from ".";

export interface User {
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
	}[];
	stripeId: string | undefined;
	isActive: boolean | undefined;
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


export const getUser = async (id = '', email = ''): Promise<User[] | Error>  => {
	try {
		if (!users) await init();
		let result: User[];
		if (id !== '') {
			result = await users
			.find({ _id: new OI(id) })
			.toArray() as User[];
		} else {
			result = await users
			.find({ email })
			.toArray() as User[];
		}

		return result;
	} catch (error) {
		console.error(error);
		return error as Error;
	}
}
