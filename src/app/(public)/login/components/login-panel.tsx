"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

type LoginSuccessResponse = {
  success: boolean;
};

type LoginErrorResponse = {
  error: string;
};

export const LoginPanel = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const response = await axios.post<
        LoginSuccessResponse | LoginErrorResponse
      >("/api/login", data);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Logged in successfully");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    },
    onError: (error: AxiosError<LoginErrorResponse>) => {
      toast.error("Failed to login", {
        description: error?.response?.data?.error ?? "",
      });
    },
  });

  const onSubmit = async ({
    username,
    password,
  }: z.infer<typeof FormSchema>) => {
    try {
      loginMutation.mutate({ username, password });
    } catch (error) {
      toast.error("Failed to login", {
        description: (error as Error)?.message,
      });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle onClick={() => toast(123123)}>Login</CardTitle>
        <CardDescription>
          Use your user name and password to login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Sign up</Button>
        <Button onClick={form.handleSubmit(onSubmit)}>Login</Button>
      </CardFooter>
    </Card>
  );
};
