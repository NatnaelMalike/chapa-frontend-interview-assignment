"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useInitiateTransfer, useVerifyPayment } from "@/hooks/useChapaApi";
import { TransferFormData, transferSchema } from "@/schemas/transfer-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function TransferForm({ banks }: any) {
  const { execute, data: detail, loading, error } = useInitiateTransfer();

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: "1000",
      account_number: "",
      account_name: "",
      bank_code: "",
    },
  });

  function onSubmit(data: TransferFormData) {
    execute(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Natnael Malike" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="23124567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bank_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Code</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {banks?.map((bank: Bank) => (
                    <SelectItem key={bank.id} value={bank.id.toString()}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Natnael Malike" {...field} disabled />
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
            "Transfer"
          )}
        </Button>
      </form>
      {error && (
        <div className="w-full mt-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
          <p className="text-center text-sm text-destructive">{error}</p>
        </div>
      )}
      {detail && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold">Transfer Response</h3>
          <p>
            <strong>Status:</strong> {detail.status}
          </p>
          <p>
            <strong>Message:</strong> {detail.message}
          </p>
          <p>
            <strong>Data:</strong> {detail.data}
          </p>
        </div>
      )}
    </Form>
  );
}
