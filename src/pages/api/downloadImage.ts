import type { NextApiRequest, NextApiResponse } from "next";
import { createWriteStream } from 'fs';
import request from 'request';
import { v4 as uuid } from 'uuid';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(400).send(`Invalid method: ${req.method}`);
        return;
    }

	const { url } = req.body as { url: string };
	const fileName = uuid() + Date.now() + '.jpeg';


	const download = function(url, filename, callback){
		request.head(url, function(err, res, body) {
		request(url).pipe(createWriteStream(`./src/assets/${filename}`)).on('close', callback);
	});
	};

	download(url, fileName, function(){
		console.log('done');
		res.status(200).json({ message: "File upload complete", fileName });
	});
}
