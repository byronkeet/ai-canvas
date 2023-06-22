import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { type User } from '../lib/mongo/user';
import type { Stripe } from 'stripe'

const SubscriptionPage = () => {
	const { data: session } = useSession();
	const [activeSubscription, setActiveSubscription] = useState(false)
	const [isActive, setIsActive] = useState(false);
	const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

	const goToCheckout = async () => {
		setIsCheckoutLoading(true);
		const res = await fetch(`/api/create-checkout-session`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		});
		
		const data = await res.json() as { redirectUrl: string };

		if (data.redirectUrl) {
		window.location.assign(data.redirectUrl);
		} else {
		setIsCheckoutLoading(false);
		console.log("Error creating checkout session");
		}
	};

	useEffect(() => {
		if (session === null || session === undefined) {
			return;
		}
		if (session.user === undefined) {
			return;
		}
		fetch(`/api/getUser/${session.user.id}`)
		.then(response => response.json())
		.then((user: { user: User[] }) => {
			
			if(!user.user[0]) {
				return;
			}
			if (user.user[0].isActive) {
				setIsActive(true) 
			} else {
				setIsActive(false)
			}

			if (user.user[0].stripeId) {
				fetch(`/api/active-subscriptions?stripeCustomerId=${user.user[0].stripeId}`)
				.then(response => response.json())
				.then((subscriptions: {subscriptions: Stripe.Subscription[]}) => {
					console.log('subscriptions subscriptions.tsx 46 :', subscriptions)
					if (subscriptions.subscriptions.length > 0) {
						setActiveSubscription(true)
					}
				})
				.catch(error => {console.log(error)});
			}
		
		})
		.catch(error => {console.log(error)});
	},[session])

	if (!session) {
		return (
		<div className="flex justify-center items-center min-h-screen">
			<p>Loading...</p>
		</div>
		);
	}

	return (
		<div className="bg-gray-100 min-h-screen">
		<div className="container mx-auto p-4">
			<h1 className="text-4xl font-bold mb-4">Subscription</h1>
			{isActive && activeSubscription ? (
			<div className="bg-white rounded-lg p-4 shadow-md">
				<h2 className="text-2xl font-bold mb-2">Active Subscription</h2>
				
			</div>
			) : (
			<div className="bg-white rounded-lg p-4 shadow-md">
				<h2 className="text-2xl font-bold mb-2">No Active Subscription</h2>
				<p>You don&apos;t have an active subscription. Click the button below to subscribe.</p>
				<button
				className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
				onClick={() => {
				if (isCheckoutLoading) return;
				void goToCheckout();
				}}
			>
				{isCheckoutLoading ? "Loading..." : "Add Payment Method"}
			</button>
			</div>
			)}
		</div>
		</div>
	);
};
  
  export default SubscriptionPage;