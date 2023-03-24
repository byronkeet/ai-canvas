import type { NextApiRequest, NextApiResponse } from "next";
import request from 'request';
import { Storage } from "@google-cloud/storage";

const GCLOUD_PROJECT_ID = process.env.PROJECT_ID as string;

interface CredentialBody {
    client_email?: string;
    private_key?: string;
}

const storage = new Storage({
    credentials: JSON.parse(process.env.BUCKET_KEYFILE_CONTENT as string) as CredentialBody,
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

	const { url } = req.body as { url: string };

	const fileName = Math.floor(Math.random() * 1000000).toString() + '-' + Date.now().toString() + '.jpeg';

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
		console.log(`https://storage.googleapis.com/${process.env.NEXT_PUBLIC_BUCKET_NAME as string}/${fileName}`);
		res.status(200).json({ message: "File upload complete", publicUrl: `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_BUCKET_NAME as string}/${fileName}` });
	});
	  
	request(url)
	.on('error', err => {
		console.error(err);
		res.status(500).json({ message: "File upload error: " + err.message });
	})
	.pipe(stream);
	

}
