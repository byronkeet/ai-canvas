
import { Storage } from "@google-cloud/storage";

const GCLOUD_PROJECT_ID = process.env.PROJECT_ID as string;

const GCLOUD_PROJECT_KEYFILE = process.env.BUCKET_KEYFILE as string

const storage = new Storage({
    keyFilename: GCLOUD_PROJECT_KEYFILE,
	projectId: GCLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.NEXT_PUBLIC_BUCKET_NAME as string);

export const createWriteStream = (filename: string, contentType?: string) => {
    const ref = bucket.file(filename);

    const stream = ref.createWriteStream({
        gzip: true,
        contentType: contentType,
		public: true
    });

    return stream;
};
