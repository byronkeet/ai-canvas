import { type NextPage } from "next";
import { useRef, useState} from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";

import Spinner from "../components/Spinner";
import { selectArtPromptErrorState } from "../store/artPromptErrorSlice";

const Art: NextPage = () => {
	const artPromptErrorState = useSelector(selectArtPromptErrorState);
	const ref = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const { data: session, status } = useSession();

	const generateImage = (prompt: string) => {
		if (status === 'unauthenticated') {
			alert( 'Please sign in to use this feature' );
			return;
		}
		setLoading(true);

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				prompt,
				n: 4,
				size: '1024x1024'
			})
		}
		
		fetch('/api/art/getImage', requestOptions)
		.then(response => response.json())
		.then( async (data: { url: string }[]) => {
			const urls = await Promise.all(data.map( (image) => {
				return handleUploadImageToGCS(image.url);
			}));
			handleInsertArtPrompt(prompt, urls);
		})
		.catch(err => {
			setLoading(false);
			console.error(err)
		});
	}

	const handleUploadImageToGCS = (url: string): Promise<string> => {
		// Wrap the function body in a new promise and resolve with the publicUrl.
		return new Promise((resolve, reject) => {
			fetch('/api/uploadImageToGCS', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			})
				.then((res) => res.json())
				.then((data) => {
					resolve(data.publicUrl);
				})
				.catch((err) => reject(err));
		});
	};


	const handleInsertArtPrompt = (prompt: string, images: string[] ) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: session?.user?.id,
				prompt,
				images
			})
		}

		fetch('/api/insertArtPrompt', requestOptions)
		.then(response => response.json())
		.then((data: { artPrompt: { acknowledged: boolean; insertedId: string } }) => {
			setLoading(false);
			if (data.artPrompt.insertedId !== undefined || data.artPrompt.insertedId !== '') {
				router.push(`/art/${data.artPrompt.insertedId}`).catch(err => console.error(err));
			}
		})
		.catch(err => {
			console.error(err)
		});
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			generateImage(ref.current?.value || '');
		}
	}

	const handleGetImage = () => {
		generateImage(ref.current?.value || '');
	}


	return (
		<div className="container mx-auto p-3 relative w-full h-full">
			<div className="flex flex-col justify-center items-center mt-2">
				<input onKeyDown={handleKeyDown} type="text" ref={ref} className="block w-full mb-5 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={status === 'unauthenticated' ? 'Please sign in to generate images' : 'Prompt'}  disabled={loading || status === 'unauthenticated'}/>
				{status === 'unauthenticated' && (
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				<button type="button" onClick={() => signIn()} className="pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
					Sign In
				</button>
				)}
				{status === 'authenticated' && (
				<button type="button" onClick={handleGetImage} className="pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
					{ loading ? <Spinner /> : 'Generate' }
				</button>
				)}
			</div>
			{artPromptErrorState && (
				<div className="flex flex-col justify-center items-center mt-20 container">
					<div className="flex justify-center items-center w-7 h-7 rounded-full bg-rose-500 text-white">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7 3.5a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0ZM8 11a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 8 11Z" fill="currentColor"></path></svg>
					</div>
					<p className="">The requested page was not found.</p>
					<p className="">Please check that the URL is valid.</p>
				</div>
			)}
		</div>
	);
};

export default Art;
