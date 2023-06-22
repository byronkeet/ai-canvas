import 'flowbite';
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { wrapper } from '../store/store';
import { Analytics } from '@vercel/analytics/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);



import Layout from "../components/Layout";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session; }>) => {
	const { store } = wrapper.useWrappedStore(pageProps);
	return (
		<>
		<Provider store={store}>
			<SessionProvider session={session}>
				<Layout>
					<Elements stripe={stripePromise}>
						<Component {...pageProps} />
					</Elements>
				</Layout>
			</SessionProvider>
		</Provider>
		<Analytics />
		</>
	);
};

export default MyApp;
