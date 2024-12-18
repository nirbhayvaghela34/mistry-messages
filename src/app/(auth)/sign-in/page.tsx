"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { signInSchema } from "@/schemas/signInSchema";
// import { handleSignIn } from "@/helpers/SignInHelper";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";

function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async ({
    identifier,
    password,
  }: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });
      console.log("Sign-In",result);
      router.replace("/dashboard");

      // const result = await handleSignIn(data);
      // if (result) {
      // } else {
      //   toast({
      //     title: "Error",
      //     description: result?.message || "Sign-in failed",
      //     variant: "destructive",
      //   });
      // }
    } catch (err) {
      let message: string = "";

      if (err instanceof AuthError) {
        switch (err.type) {
          case "CredentialsSignin":
            message = "Invalid credentials";
          default:
            message = "Something went wrong.";
        }
      }
      toast({
        title: "Error",
        description: message || "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
