import { type NextPage } from "next";
import { useRef, useState} from 'react';
import Image from "next/image";

import Spinner from "../../components/Spinner";
import ImageOverlay from "../../components/ImageOverlay";

const Art: NextPage = () => {
	const ref = useRef<HTMLInputElement>(null);
	const [images, setImages] = useState<{ url: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState('');

	const generateImage = (prompt: string) => {
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
		.then((data: { url: string }[]) => {
			setImages(data);
			setLoading(false);
		})
		.catch(err => {
			setLoading(false);
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

	const handleSelectedImage = (url: string) => {
		setSelectedImage(url);
		setIsOpen(true);
	}

	return (
		<div className="container mx-auto p-3 relative w-full h-full">
			<div className="flex flex-col justify-center items-center mt-2">
				<input onKeyDown={handleKeyDown} type="text" ref={ref} className="block w-full mb-5 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Prompt"  disabled={loading}/>
				<button type="button" onClick={handleGetImage} className="pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{ loading ? <Spinner /> : 'Generate' }</button>
			</div>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 my-10 md:my-20' >
				{Object.keys(images).length !== 0 && 
				images.map(image => (
					<div key={Math.floor(Math.random()*1000)}  className="aspect-square bg-gray-50 w-full h-full cursor-pointer">
						<Image onClick={() => handleSelectedImage(image.url)}   src={image.url} alt='generated image' width={1024} height={1024} className="w-full h-full object-contain"/>
					</div>
				))
				}
			</div>
			{isOpen && (<ImageOverlay url={selectedImage} setIsOpen={setIsOpen} isOpen={isOpen} />) }
		</div>
	);
};

export default Art;
