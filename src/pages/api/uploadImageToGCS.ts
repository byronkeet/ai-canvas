import type { NextApiRequest, NextApiResponse } from "next";
import request from 'request';
import { Storage } from "@google-cloud/storage";

const GCLOUD_PROJECT_ID = process.env.PROJECT_ID as string;

const GCLOUD_PROJECT_KEYFILE = process.env.BUCKET_KEYFILE as string

const storage = new Storage({
    keyFilename: GCLOUD_PROJECT_KEYFILE,
	projectId: GCLOUD_PROJECT_ID,
});

interface ExtendedNextApiRequest extends NextApiRequest {
	body: { url: string } | string;
  }


export default function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(400).send(`Invalid method: ${req.method || 'undefined'}`);
        return;
    }
	
	let body: { url: string };
	if (typeof req.body === 'string') {
		body = JSON.parse(req.body) as { url: string };
	} else {
		body = req.body;
	}

	const { url } = body;
	console.log(url);

	const fileName = Date.now().toString() + '.jpeg';

	const bucket = storage.bucket(process.env.NEXT_PUBLIC_BUCKET_NAME as string);

	const file = bucket.file(fileName);

	const stream = file.createWriteStream({
		metadata: {
		  contentType: 'image/jpeg',
		},
		public: true,
	  });
	  stream.on('error', err => {
		console.error(err);
		res.status(500).json({ message: "File upload error: " + err.message });
	  });
	  stream.on('finish', () => {
		res.status(200).json({ message: "File upload complete", publicUrl: `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_BUCKET_NAME as string}/${fileName}` });
	});
	  
	request(url)
	.on('error', err => {
		console.error(err);
		res.status(500).json({ message: "File upload error: " + err.message });
	})
	.pipe(stream);
	

}
