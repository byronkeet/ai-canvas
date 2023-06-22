import type { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from "../../../lib/mongo/user";

const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const { id } = req.query;
		if (!id) return res.status(400).json({ error: 'Missing id' });
		if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
		try {
			const data = await getUser(id);
			if (data instanceof Error) return res.status(500).json({ error: data });
			return res.status(200).json({ user: data });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
	res.setHeader('Allow', ['GET']);
	res.status(405).end(`Only GET method Allowed. Try again.`);
}

export default getUserById;