import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { menuItems } from './Navigation';

const Footer = () => {
	return (
		<footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-900">
			<div className='container mx-auto'>
			<div className="sm:flex sm:items-center sm:justify-between">
				<Link href="/" className="flex items-center mb-4 sm:mb-0">
					<Image src="/logo.png" className="w-auto h-8 mr-3" alt="Artificality Logo" width={40} height={40}/>
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Artificality</span>
				</Link>
				<ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
					{menuItems.map(item => (
						<li key={item.name}>
							<Link className="mr-4 hover:underline md:mr-6 " href={item.route}>{item.name}</Link>
						</li>
					))}
				</ul>
			</div>
			<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 3 <a href="https://Artificality.com/" className="hover:underline">Artificality™</a>. All Rights Reserved.
			</span>
			</div>
		</footer>
	)
}

export default Footer