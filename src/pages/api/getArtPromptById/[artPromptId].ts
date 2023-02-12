import type { NextApiRequest, NextApiResponse } from 'next';

import { getArtPrompt } from "../../../lib/mongo/getArtPrompt";

const getArtPromptById = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const { artPromptId } = req.query;
		if (!artPromptId) return res.status(400).json({ error: 'Missing Art Prompt id' });
		if (typeof artPromptId !== 'string') return res.status(400).json({ error: 'Invalid id' });
		try {
			const { artPrompt, error } = await getArtPrompt(artPromptId);
			if (error) return res.status(500).json({ error });
			console.log(artPrompt);
			if (!artPrompt) return res.status(404).json({ error: 'No art prompt found' });
			const data = {
				images: artPrompt.images,
				prompt: artPrompt.prompt
			}
			return res.status(200).json(data);
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
	res.setHeader('Allow', ['GET']);
	res.status(405).end(`Only GET method Allowed. Try again.`);
}

export default getArtPromptById;
