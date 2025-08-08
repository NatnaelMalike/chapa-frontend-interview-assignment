"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import { Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PaymentFormData, paymentSchema } from "@/schemas/payment-schema";
import { useInitializePayment } from "@/hooks/useChapaApi";
import { generateTxRef } from "@/services/chapa-api";

export function PaymentForm() {
  const { data: response, execute, loading, error } = useInitializePayment();
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 100, // Fixed amount
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
  });

  // Handle successful payment initialization
  useEffect(() => {
    if (response && response.data && response.data.checkout_url) {
      window.location.href = response.data.checkout_url;
    }
  }, [response]);

  async function onSubmit(data: PaymentFormData) {
    const callbackUrl =
      process.env.CALLBACK_URL || "https://chapa-frontend-mk.vercel.app/api/chapa/callback";
    const returnUrl = process.env.RETURN_URL || "https://chapa-frontend-mk.vercel.app/thank-you";

    const paymentData = {
      ...data,
      tx_ref: generateTxRef(),
      callback_url: callbackUrl,
      return_url: returnUrl,
      currency: "ETB",
      amount: data.amount.toString(), // Fixed at 100
    };

    try {
      await execute(paymentData);
    } catch (error) {
      console.error('Payment initialization failed:', error);
    }
  }

  return (
    <Card className="shadow-sm border-0 border-b mt-6">
      <CardHeader className="space-y-6 pb-6">
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Initialize Payment
        </CardTitle>
        <CardDescription>
          Create a new payment transaction using Chapa API
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-card-foreground">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        type="number"
                        className="h-12 rounded-lg border-border text-base bg-gray-100 cursor-not-allowed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-card-foreground">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
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
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-card-foreground">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="h-12 rounded-lg border-border text-base focus:border-primary focus:ring-primary/20 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-card-foreground">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g. 0790-12-34-56"
                        type="tel"
                        className="h-12 rounded-lg border-border pr-12 text-base focus:border-primary focus:ring-primary/20 transition-all duration-200"
                        {...field}
                      />
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
                "Initialize Payment"
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
  );
}
