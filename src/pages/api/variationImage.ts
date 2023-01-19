import type { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import fs from 'fs';

interface VariationImageBody {
	image: string;
	mask: string;
	prompt: string;
	n: number;
	size: string;
}

interface VariationImageData {
	created: number;
	data: { url: string }[]
}

const variationImage = async (req: NextApiRequest, res: NextApiResponse) => {
	const { image, n, size } = req.body as VariationImageBody;

	const form = new FormData();
	form.append('image', fs.createReadStream(image));
	form.append('n', n);
	form.append('size', size);
	
	const options: object = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
		},
		body: form
	}

	try {
		const response = await fetch(`https://api.openai.com/v1/images/variations`, options);
		const data = await response.json() as VariationImageData;

		res.status(200);
		res.json({ data });
	} catch (err) {
		console.error(err);
		res.status(500);
		res.json({ message: 'Could not generate image.'})
	}
}

export default variationImage;