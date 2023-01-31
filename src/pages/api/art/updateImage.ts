import type { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import fs from 'fs';

interface UpdateImageBody {
	image: string;
	mask: string;
	prompt: string;
	n: number;
	size: string;
}

interface UpdateImageData {
	created: number;
	data: { url: string }[]
}

const updateImage = async (req: NextApiRequest, res: NextApiResponse) => {
	const { image, mask, prompt, n, size } = req.body as UpdateImageBody;

	const form = new FormData();
	form.append('image', fs.createReadStream(image));
	form.append('mask', fs.createReadStream(mask));
	form.append('prompt', prompt);
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
		const response = await fetch(`https://api.openai.com/v1/images/edits`, options);
		const data = await response.json() as UpdateImageData;

		res.status(200);
		res.json({ data });
	} catch (err) {
		console.error(err);
		res.status(500);
		res.json({ message: 'Could not generate image.'})
	}
}

export default updateImage;