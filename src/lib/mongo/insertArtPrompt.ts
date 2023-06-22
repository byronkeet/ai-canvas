import type { Db, Collection, MongoClient, ObjectId } from "mongodb";
import { ObjectId as OI } from "mongodb";
import clientPromise from ".";

interface ArtPrompt {
	_id?: ObjectId;
	userId: string | ObjectId;
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
		artPrompts = db.collection('artPrompts');
	} catch (error) {
		throw new Error('Failed to connect to database');
	}
};

init()
.catch(console.error);


export const insertArtPrompt = async (artPrompt: ArtPrompt) => {
	if (artPrompt.userId === '' || artPrompt.userId === undefined) return { error: 'No user Id provided.' };
	artPrompt.userId = new OI(artPrompt.userId);
	
	try {
		if (!artPrompts) await init();

		const result = await artPrompts.insertOne( artPrompt );
		console.log('result insertArtPrompt.ts 39 :', result);
		return { artPrompt: result };
	} catch (error) {
		console.error(error);
		return { error: 'Failed to insert art prompt' };
	}
}
