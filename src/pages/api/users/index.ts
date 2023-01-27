import type { NextApiRequest, NextApiResponse } from 'next';

import { getUsers } from "../../../lib/mongo/users";

const getUsersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		try {
			const { users, error } = await getUsers();
			if (error) return res.status(500).json({ error });
			return res.status(200).json({ users });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
	res.setHeader('Allow', ['GET']);
	res.status(405).end(`Only GET method Allowed. Try again.`);
}

export default getUsersHandler;