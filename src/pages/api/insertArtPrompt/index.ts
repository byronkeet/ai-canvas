import type { NextApiRequest, NextApiResponse } from 'next';

import { insertArtPrompt } from "../../../lib/mongo/insertArtPrompt";

interface InsertArtPromptHandlerData {
	userId: string;
	prompt: string;
	images: string[];
}

const insertArtPromptHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userId, prompt, images } = req.body as InsertArtPromptHandlerData;
	const data = {
		userId,
		prompt,
		images
	}
	if (req.method === "POST") {
		try {
			const { artPrompt, error } = await insertArtPrompt(data);
			if (error) return res.status(500).json({ error });
			return res.status(200).json({ artPrompt });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
	res.setHeader('Allow', ['POST']);
	res.status(405).end(`Only POST method Allowed. Try again.`);
}

export default insertArtPromptHandler;