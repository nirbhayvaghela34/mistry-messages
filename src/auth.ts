/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or password", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any): Promise<any> => {
        // Connect to database
        await dbConnect();

        try {
          // Find user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email/username");
          }

          // Ensure user account is verified
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          // Verify password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new CredentialsSignin(err.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        // console.log("token",token);
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      // console.log("Final Session:", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
});
