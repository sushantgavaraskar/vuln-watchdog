import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://localhost:5000/api/auth/login", credentials);
          if (res.data.token) {
            return { ...res.data, email: credentials.email, token: res.data.token };
          }
          return null;
        } catch {
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.token = user.token;
      return token;
    },
    async session({ session, token }) {
      session.user.token = token.token;
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };