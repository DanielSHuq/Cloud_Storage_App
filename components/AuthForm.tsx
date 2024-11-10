"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
});
type FormType = "sign-in" | "sign-up";
const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setIsErrorMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="form-title">
          {type === "sign-in" ? "Sign In" : "Sign up"}
        </h1>
        {type === "sign-up" ? (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form-label">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-label">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  className="shad-input"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="form-submit-button"
          disabled={isLoading}
        >
          {type === "sign-in" ? "Sign In" : "Sign up"}
          {isLoading && (
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={24}
              height={24}
              className="ml-2 animate-spin"
            />
          )}
        </Button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="body-2 flex justify-center">
          <p className="text-light-100">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="ml-1 font-medium text-brand"
          />
        </div>
      </form>
    </Form>
  );
};

export default AuthForm;
