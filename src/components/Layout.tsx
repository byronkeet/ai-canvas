import React from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';
// import Footer from './Footer';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className='layout'>
			<Head>
				<title>AI CANVAS</title>
				<meta name="description" content="AI CANVAS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header>
				<Navigation />
			</header>
			<main className=''>
				{children}
			</main>
			<footer>
				<Footer />
				<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.2/flowbite.min.js" async></script>
			</footer>
		</div>
	);
}

export default Layout;