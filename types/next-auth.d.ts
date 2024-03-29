import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
	id: string;
	email: string;
	name: string;
	image: string;
  }
  interface Session {
    user: User
  }
}