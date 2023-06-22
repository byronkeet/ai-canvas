import NextAuth from "next-auth";
import type {JWT} from "next-auth/jwt";
import type { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import Stripe from 'stripe';
import type { Db, MongoClient, } from "mongodb";

import clientPromise from "../../../lib/mongo";

let client: MongoClient;
let db: Db;

interface SessionProps {
	session: Session;
	user: User;
	token: JWT;
}

const {
	GOOGLE_CLIENT_ID = '',
	GOOGLE_CLIENT_SECRET = '',
	EMAIL_SERVER_HOST = '' ,
	EMAIL_SERVER_PORT = '',
	EMAIL_SERVER_USER = '',
	EMAIL_SERVER_PASSWORD = '',
	EMAIL_FROM = '',
} = process.env;

export const authOptions = {
  // Configure one or more authentication providers
	adapter: MongoDBAdapter(clientPromise, { databaseName: 'development' }),
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		  }),
		EmailProvider({
			server: {
				host: EMAIL_SERVER_HOST,
				port: EMAIL_SERVER_PORT,
				auth: {
					user: EMAIL_SERVER_USER,
					pass: EMAIL_SERVER_PASSWORD
				}
				},
				from: EMAIL_FROM
		}),
	],
	callbacks: {
		session: (params: SessionProps ) => {
			const { session, user } = params;
			if (session?.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	events: {
		createUser: async ({ user }: { user: { email?: string, name?: string } }) => {
			// Create stripe API client using the secret key env variable
			const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
				apiVersion: "2022-11-15",
			});
		
			  // Create a stripe customer for the user with their email address
			  await stripe.customers.create({ email: user.email, name: user.name }).then(async (customer) => {
					client = await clientPromise;
					db = client.db(process.env.DB_NAME);
					const users =  db.collection(process.env.USERS_COLLECTION_NAME as string);
					console.log('user ...nextauth 73 :', user);
					const updatedUser = await users.findOneAndUpdate(
						{ email: user.email },
						{ $set: { stripeId: customer.id } },
						{ returnDocument: 'after' }
					);
						console.log('updatedUser ...nextauth 79 :', updatedUser);
					  return updatedUser.value;
				});
		}
	}
}
export default NextAuth(authOptions)