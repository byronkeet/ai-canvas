import type { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from "../../../lib/mongo/user";

const getUserByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const { email } = req.body as { email: string };
		try {
			const { user, error } = await getUser('', email);
			if (error) return res.status(500).json({ error });
			return res.status(200).json({ user });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
	res.setHeader('Allow', ['GET']);
	res.status(405).end(`Only GET method Allowed. Try again.`);
}

export default getUserByEmail;