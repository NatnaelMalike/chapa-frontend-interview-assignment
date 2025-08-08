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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoginFormData, loginSchema } from "@/schemas/login-schema";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { testCredentials } from "@/data/users";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { login, loading, error } = useAuthStore();
  const router = useRouter();
  const [isVisible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState("");

  const togglePasswordVisibility = () => {
    setVisible(!isVisible);
  };

  const fillTestCredentials = (credentialId: string) => {
    const credential = testCredentials.find((cred) => cred.id === credentialId);
    if (!credential) return;
  
    setIsAnimating(true);
  
    setTimeout(() => {
      form.setValue("email", credential.email, { shouldValidate: true });
    }, 100);
  
    setTimeout(() => {
      form.setValue("password", credential.password, { shouldValidate: true });
    }, 300);
  
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  async function onSubmit(data: LoginFormData) {
    const user = await login(data.email, data.password, data.rememberMe);
    if (user) {
      const role = user.role;
      if (role === "admin") router.replace("/admin");
      else if (role === "superadmin") router.replace("/superadmin");
      else router.replace("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-2 sm:p-6 lg:p-8">
  <div className="w-full max-w-md">
    {/* Header */}
    <div className="text-center">
      <div className="mb-4 mt-8 sm:mt-6 inline-block">
        <Image
          src="/chapa_gradient.png"
          alt="Chapa Logo"
          width={210}
          height={70}
          className="mx-auto"
          priority
        />
      </div>
      <h1 className="mb-2  text-xl sm:text-2xl font-bold text-foreground">Welcome to Chapa</h1>
      <p className="leading-relaxed text-muted-foreground">
        <i>Seamless Payments, Endless Opportunities!</i>
      </p>
    </div>

    {/* Login Card */}
    <Card className="bg-transparent shadow-sm border-0 border-b mt-6">
      <CardHeader className="space-y-6 pb-6">
       
        {/* Test Credentials Selector */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-card-foreground">
            <Users className="mr-2 h-4 w-4" />
            Quick Test Login
          </label>
          <div className="flex gap-2">
            <Select
              value={selectedCredential}
              onValueChange={setSelectedCredential}
            >
              <SelectTrigger className="flex-1 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all duration-200">
                <SelectValue placeholder="Choose test user..." />
              </SelectTrigger>
              <SelectContent>
                {testCredentials.map((cred) => (
                  <SelectItem key={cred.id} value={cred.id}>
                    <div className="flex items-center">
                      <span className="font-medium">{cred.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({cred.role})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => selectedCredential && fillTestCredentials(selectedCredential)}
              disabled={!selectedCredential || isAnimating}
              className="h-9 px-4 rounded-lg border-primary/20 hover:bg-primary/5 transition-all duration-200"
            >
              {isAnimating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              ) : (
                "Fill"
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-card-foreground">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="h-12 rounded-lg border-border text-base focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      {...field}
                    />
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
                  <FormLabel className="text-base font-medium text-card-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-lg border-border pr-12 text-base focus:border-primary focus:ring-primary/20 transition-all duration-200"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-card-foreground"
                      >
                        {isVisible ? (
                          <EyeIcon className="h-5 w-5" />
                        ) : (
                          <EyeOffIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-6">
        {error && (
          <div className="w-full rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-center text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  </div>
</div>
  );
}
