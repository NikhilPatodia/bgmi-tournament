"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withdrawalSchema } from "@/lib/validations/forms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

export function WithdrawalForm({
  winningBalance = 0,
  onSubmit,
  isSubmitting,
}) {
  const schema = withdrawalSchema.superRefine((data, ctx) => {
    if (data.amount > Number(winningBalance)) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: `Max withdrawable is ${formatINR(winningBalance)}`,
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: "", upiId: "" },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => onSubmit(values))}
    >
      <p className="text-xs text-slate-500">
        Available winning balance:{" "}
        <span className="text-amber-300 font-bold">{formatINR(winningBalance)}</span>
      </p>

      <div>
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          step="1"
          min={1}
          {...form.register("amount")}
        />
        {form.formState.errors.amount && (
          <p className="text-[11px] text-red-400 mt-1">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="upiId">UPI VPA</Label>
        <Input
          id="upiId"
          placeholder="username@okhdfcbank"
          {...form.register("upiId")}
        />
        {form.formState.errors.upiId && (
          <p className="text-[11px] text-red-400 mt-1">
            {form.formState.errors.upiId.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Request withdrawal"}
      </Button>
    </form>
  );
}
