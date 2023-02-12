import Image from 'next/image';
import React from 'react';
import type { Dispatch, SetStateAction } from "react";

interface ImageOverlayProps {
	url: string;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
}

const ImageOverlay = (props: ImageOverlayProps) => {
	const { url, setIsOpen } = props;
	return (
		<div className={`overlay absolute top-0 left-0 w-full h-full  z-1 flex flex-col items-center justify-center transition ease-in-out duration-500 bg-white p-4`}>
			<div className='flex justify-between w-full flex-col md:flex-row'>
				<button onClick={() => setIsOpen(false)} className={` bg-blue-700 text-white border-0 py-2 px-5 cursor-pointer`}><span><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></span> Back</button>
				<div className='flex space-x-2'>
					<button onClick={() => setIsOpen(false)} className={` bg-blue-700 text-white border-0 py-2 px-5 cursor-pointer`}>Variation</button>
					<button onClick={() => setIsOpen(false)} className={` bg-blue-700 text-white border-0 py-2 px-5 cursor-pointer`}>Save</button>
					<button onClick={() => setIsOpen(false)} className={` bg-blue-700 text-white border-0 py-2 px-5 cursor-pointer`}>Download</button>
				</div>
			</div>
			<div className=' flex-1 h-full w-full flex items-center justify-center'>
				<div className='relative w-[90%] pb-[90%]   md:w-[45%] h-0 md:pb-[45%]  bg-gray-50'>
					<Image src={url} alt='Larger generated image' width={1024} height={1024} className={`absolute top-0 left-0 w-full h-full`}/>
				</div>
			</div>
		</div>
	)
}

export default ImageOverlay;