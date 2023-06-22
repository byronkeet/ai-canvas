// pages/api/active-subscriptions.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const { stripeCustomerId } = req.query;

  if (!stripeCustomerId || typeof stripeCustomerId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid Stripe customer ID' });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
    });
	console.log('subscriptions active-subscriptions.ts 27 :',subscriptions);
    return res.status(200).json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.error('Stripe API error:', error);
    return res.status(500).json({ message: 'Failed to fetch active subscriptions' });
  }
};

export default handler;