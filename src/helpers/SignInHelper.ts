"use server";
import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/schemas/signInSchema";
import * as z from "zod";
import { AuthError } from "next-auth";

export async function handleSignIn(data: z.infer<typeof signInSchema>) {
  const { identifier, password } = data;

  try {
    await signIn("credentials", {
      redirect: false, // Prevent automatic redirection
      identifier,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };
        default:
          return {
            message: "Something went wrong.",
          };
      }
    }
  }
} 

export async function handleSignOut() {
  await signOut();
}
