import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Navbar , Dropdown, Avatar } from 'flowbite-react';


const menuItems = [
	{ name: 'AI ART', route: '/art' },
	{ name: 'AI WRITING', route: '/writing' },
];

const loggedInMenuItems = [
	{ name: 'Dashboard', route: '/dashboard' },
	{ name: 'Sign Out', route: '/' },
] 

const Navigation = () => {
	const router = useRouter();
	return (
		<Navbar
			fluid={true}
			rounded={true}
		>
			<Navbar.Brand href="/">
				<Image
					src="/logo.png"
					className="w-auto h-auto mr-3"
					alt="Flowbite Logo"
					width={40}
					height={40}
				/>
				<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white uppercase">
				Artificality
				</span>
			</Navbar.Brand>
			<div className="flex md:order-2">
				<Dropdown
					arrowIcon={false}
					inline={true}
					label={<Avatar alt="User settings" img="/me.png" rounded={true}/>}
				>
					<Dropdown.Header>
						<span className="block text-sm">Byron Keet</span>
						<span className="block truncate text-sm font-medium">keetbis@gmail.com</span>
					</Dropdown.Header>
					{loggedInMenuItems.map(item => (
						<Dropdown.Item key={item.name}>
							<Link href={item.route}>{item.name}</Link>
						</Dropdown.Item>
					))}
				</Dropdown>
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				{menuItems.map(item => (
					<Navbar.Link
						href={item.route}
						active={ router.pathname === item.route ? true : false}
						key={item.name}
					>
						{item.name}
					</Navbar.Link>
				))}
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Navigation;