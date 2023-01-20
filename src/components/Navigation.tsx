import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';


const menuItems = [
	{ name: 'HOME', route: '/' },
	{ name: 'AI ART', route: '/art' },
	{ name: 'AI WRITING', route: '/writing' },
	{ name: 'SIGN IN', route: '/signin' },
]

const Navigation = () => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const router = useRouter();
	console.log(router);

	const handleShowMobileMenu = (): void => {
		setShowMobileMenu(!showMobileMenu);
	}

	return (
		<nav className='bg-white border-gray-200 px-2 sm:px-4 py-2.5'>
			<div className='container flex flex-wrap items-center justify-between mx-auto'>
				<Link href='/' className='flex justify-center items-center'>
					<Image src='/logo.png' alt='Company Logo' width={40} height={40} className='w-auto h-auto mr-3' />
					<span className='font-display uppercase font-semibold text-xl self-center whitespace-nowrap'>Artificality</span>
				</Link>
				<button onClick={handleShowMobileMenu} type='button' className='md:hidden inline-flex items-center p-2 ml-3 text-sm tex-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'>
					<span className='sr-only'>Open main menu</span>
					<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
				</button>
				<div className={`${ showMobileMenu ? '' : 'hidden' } md:block w-full md:w-auto`}>
					<ul className='flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white'>
						{menuItems.map(item => (
							<li key={item.name}>
								<Link href={item.route} className={`${router.pathname === item.route ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-700 hover:bg-gray-100'} block py-2 pl-3 pr-4  rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0`}>{item.name}</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Navigation;