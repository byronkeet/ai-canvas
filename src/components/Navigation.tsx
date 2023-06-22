import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';


export const menuItems = [
	{ name: 'Home', route: '/' },
	{ name: 'AI Art', route: '/art' },
	{ name: 'AI Writing', route: '/writing' },
]

const Navigation = () => {
	const { data: session } = useSession();
	const router = useRouter();


	return (
		<nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
			<div className="container flex flex-wrap items-center justify-between mx-auto">
				<Link href="/" className="flex items-center">
					<Image src="/logo.png" className="w-auto h-6 mr-3 sm:h-9" alt="Artificality Logo" width={40} height={40}/>
					<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white uppercase font-display">Artificality</span>
				</Link>
				<div className="flex items-center md:order-2">
					{!session && (
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						<div className='cursor-pointer' onClick={() => signIn()}>
							Sign In
						</div>
					)}
					<button type="button" className={`${session ? '' : 'hidden'} flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600`} id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
						<span className="sr-only">Open user menu</span>
						<Image className="w-8 h-8 rounded-full" src={session?.user?.image || '/default.png'} alt="user photo" width={32} height={32} />
					</button>
					<div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
						<div className="px-4 py-3">
							<span className="block text-sm text-gray-900 dark:text-white">{session?.user?.name}</span>
							<span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">{session?.user?.email}</span>
						</div>
						<ul className="py-2" aria-labelledby="user-menu-button">
							<li>
								<Link href="/subscriptions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Subscriptions</Link>
							</li>
							<li>
								{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
								<Link onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}  href='/' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</Link>
							</li>
						</ul>
					</div>
					<button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
						<span className="sr-only">Open main menu</span>
						<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
					</button>
				</div>
				<div className="hidden w-full md:block md:w-auto" id="navbar-default">
					<ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
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