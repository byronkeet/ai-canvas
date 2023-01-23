import React from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

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
			</footer>
		</div>
	);
}

export default Layout;