import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import clientPromise from "../../../lib/mongo";

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
		session: async ({ session, user, token }) => {
			if (session?.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
}
export default NextAuth(authOptions)