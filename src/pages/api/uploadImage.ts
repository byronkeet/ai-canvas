import type { NextApiRequest, NextApiResponse } from "next";
import { createReadStream, unlink } from "fs";
import * as gcs from "../../lib/google/gcs";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(400).send(`Invalid method: ${req.method}`);
        return;
    }

	const { fileName } = req.body as { url: string };

	// const { fileName } = req.body as { fileName: string };

	createReadStream(`src/assets/${fileName}`)
        .pipe(gcs.createWriteStream(fileName, 'image/jpeg'))
        .on("finish", () => {
			unlink(`src/assets/${fileName}`, (err) => {
				if (err) {
					console.error(err)
					res.status(500).json({ message: "File uploaded but not deleted from server", fileName: 'test4.jpeg' });
				}
			});
            res.status(200).json({ message: "File upload complete", publicUrl: `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_BUCKET_NAME as string}/${fileName}` });
        })
        .on("error", (err) => {
            console.error(err.message);
            res.status(500).json("File upload error: " + err.message);
        });
}
