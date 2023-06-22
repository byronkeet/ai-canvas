import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import clientPromise from "../../../lib/mongo";
import type { Db, MongoClient, } from "mongodb";

const endpointSecret = process.env.STRIPE_WEBHOOK_KEY as string;

let client: MongoClient;
let db: Db;

export const config = {
  api: {
    bodyParser: false, // don't parse body of incoming requests because we need it raw to verify signature
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const requestBuffer = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2022-11-15',
    });

    let event;

    try {
      // Use the Stripe SDK and request info to verify this Webhook request actually came from Stripe
      event = stripe.webhooks.constructEvent(
        requestBuffer.toString(), // Stringify the request for the Stripe library
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, (err as Error).message);
      return res.status(400).send(`Webhook signature verification failed.`);
    }
	console.log('event stripe.ts 39 : ', event);
    // Handle the event
    switch (event.type) {
      // Handle successful subscription creation
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        client = await clientPromise;
		db = client.db(process.env.DB_NAME);
		const usersCollection =  db.collection(process.env.USERS_COLLECTION_NAME as string);
		console.log('subscription stripe.ts 48 : ', subscription);
        await usersCollection.updateOne(
          // Find the customer in our database with the Stripe customer ID linked to this purchase
          { stripeId: subscription.customer as string },
          // Update that customer so their status is now active
          { $set: { isActive: true } }
        );
        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    // Return a 500 error
    console.log(err);
    res.status(500).end();
  }
};

export default handler;
