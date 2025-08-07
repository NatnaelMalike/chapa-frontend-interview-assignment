"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component
import { loginSchema } from "@/schemas/login-schema";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false, // Default value for rememberMe
    },
  });
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [isvisible, setVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setVisible(!isvisible);
  };

  async function  onSubmit(data: z.infer<typeof loginSchema>) {
    const user = await login(data.email, data.password, data.rememberMe);
    if (user) { // Check if a user object was returned
      const role = user.role;
      if (role === "admin") router.push("/admin-dashboard");
      else if (role === "super-admin") router.push("/super-admin");
      else router.push("/dashboard");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nanaelmalike@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isvisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-3 pr-10 py-6 rounded-md bg-background/50 border-muted transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      >
                        {isvisible ? (
                          <EyeOffIcon className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    Remember Me
                  </FormLabel>
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardFooter>
    </Card>
  );
}
