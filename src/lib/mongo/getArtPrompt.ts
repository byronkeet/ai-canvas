import type { Db, Collection, MongoClient, ObjectId } from "mongodb";
import { ObjectId as OI } from "mongodb";
import clientPromise from ".";

interface ArtPrompt {
	_id: ObjectId;
	userId: ObjectId;
	prompt: string;
	images: string[];
}

let client: MongoClient;
let db: Db;
let artPrompts: Collection<ArtPrompt>;

const init = async () => {
	if (db) return;
	try {
		client = await clientPromise;
		db = client.db(process.env.DB_NAME);
		artPrompts =  db.collection('artPrompts');
	} catch (error) {
		throw new Error('Failed to connect to database');
	}
};

init()
.catch(console.error);


export const getArtPrompt = async (artPromptId = '') => {
	try {
		if (!artPrompts) await init();
		let result: ArtPrompt[] = [];
		if (artPromptId !== '') {
			result = await artPrompts
			.find({ _id: new OI(artPromptId) })
			.toArray() as ArtPrompt[];
		}

		return { artPrompt: result[0] };
	} catch (error) {
		console.error(error);
		return { error: 'Failed to fetch art prompt' };
	}
}
