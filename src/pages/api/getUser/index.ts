import type { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from "../../../lib/mongo/user";

const getUserByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const { email } = req.body as { email: string };
		try {
			const data = await getUser('', email);
			if (data instanceof Error) return res.status(500).json({ error: data });
			return res.status(200).json({ user: data });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
	res.setHeader('Allow', ['GET']);
	res.status(405).end(`Only GET method Allowed. Try again.`);
}

export default getUserByEmail;