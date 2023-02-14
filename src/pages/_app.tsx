import 'flowbite';
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppProps } from "next/app";
import { wrapper } from '../store/store';

import Layout from "../components/Layout";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session; }>) => {
	return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionProvider>
	);
};

export default wrapper.withRedux(MyApp);
