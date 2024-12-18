"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SendMessageSchema } from "@/schemas/sendMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const messages =
  "What’s the most beautiful place you’ve ever been to?||If you could give your younger self one piece of advice, what would it be?||What’s a dream you have that you haven’t shared with anyone?||If you could solve one global issue, which one would you tackle first?||What’s the most interesting hobby you’ve picked up recently?";
function PublicProfile() {
  // const [messages, setMessages] = useState<string>(defaultMessages);
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SendMessageSchema>>({
    resolver: zodResolver(SendMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = form;

  const onSubmit = async (data: z.infer<typeof SendMessageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });

      toast({
        title: "Success",
        description: response.data.message || "Message sent Successfully",
      });

      reset({ content: "" }); // Reset form after successful submission
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-5 mt-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Send Anonymous message to @{params.username}
                </FormLabel>
                <Textarea
                  placeholder="Write your anonymous message here"
                  className="resize-none"
                  {...field}
                  value={selectedMessage}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="mx-auto block">
            Send It
          </Button>
        </form>
      </Form>
      <div className="m-auto mt-10">
        {/* <Button>Suggest Message</Button> */}
        <p className="text-lg font-bold my-4">
          Click on any message below to select it
        </p>
        <Card className="card-bordered">
          <CardHeader className="text-xl font-bold">Messages</CardHeader>
          {messages.split("||").map((message, index) => (
            <Card
              key={index}
              className="card-bordered flex justify-center items-center m-4"
            >
              <Button
                className="bg-white text-black hover:bg-white"
                onClick={() => setSelectedMessage(message)}
              >
                {message}
              </Button>
            </Card>
          ))}
        </Card>
      </div>
      <Separator className="my-6 border-t border-gray-300" />
      <div className="text-center">
        <p className="text-lg font-bold my-4">Get Your Message Board</p>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default PublicProfile;
