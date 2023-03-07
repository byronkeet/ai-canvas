import type { NextApiRequest, NextApiResponse } from 'next';

interface GetImageBody {
	prompt: string;
	n: number;
	size: string;
}

interface GetImageData {
	created: number;
	data: { url: string }[]
}

const getImage = async (req: NextApiRequest, res: NextApiResponse) => {
	const { prompt, n, size } = req.body as GetImageBody;
	const options: object = {
		method: 'POST',
		headers: {
			authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt,
			n,
			size

		})
		
	}

	try {
		const response = await fetch(`https://api.openai.com/v1/images/generations`, options);
		const data = await response.json() as GetImageData;

		res.status(200);
		res.json(data.data);
	} catch (err) {
		console.error(err);
		res.status(500);
		res.json({ err: 'failed'})
	}
}

export default getImage;