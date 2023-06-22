// components/SubscribeButton.tsx

import { useState } from 'react';
import type {  MouseEvent } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

const SubscribeButton = () => {
 	const stripe = useStripe();

  const [loading, setLoading] = useState(false);

  const redirectToCheckout = (event: MouseEvent<HTMLButtonElement>) => {
	event.preventDefault();
	setLoading(true);
  
	void (async () => {
	  try {
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
		  setLoading(false);
		  console.log("Error creating checkout session");
		}
	  } catch (error) {
		console.error('Error:', error);
		setLoading(false);
		alert('There was an issue redirecting to the checkout page. Please try again.');
	  } finally {
		setLoading(false); // Set loading to false when the Stripe Checkout page opens or an error occurs
	  }
	})();
  };
  

  return (
	<div className="flex flex-col items-center justify-center">
    <button
      onClick={redirectToCheckout}
      disabled={!stripe || loading}
      className={`bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ${
        !stripe || loading ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {loading ? 'Loading...' : 'Subscribe for $100/month'}
    </button>
	</div>
  );
};

export default SubscribeButton;
