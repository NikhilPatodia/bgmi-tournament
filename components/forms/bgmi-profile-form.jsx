"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bgmiProfileSchema } from "@/lib/validations/forms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function BgmiProfileForm({ defaults, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(bgmiProfileSchema),
    defaultValues: {
      bgmiIgn: "",
      bgmiId: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (defaults) {
      form.reset({
        bgmiIgn: defaults.bgmiIgn || "",
        bgmiId: defaults.bgmiId || "",
        phone: defaults.phone || "",
      });
    }
  }, [defaults, form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => onSubmit(values))}
    >
      <div>
        <Label htmlFor="bgmiIgn">BGMI IGN</Label>
        <Input id="bgmiIgn" placeholder="Mortal_OP" {...form.register("bgmiIgn")} />
        {form.formState.errors.bgmiIgn && (
          <p className="text-[11px] text-red-400 mt-1">
            {form.formState.errors.bgmiIgn.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bgmiId">Character ID (10 digits)</Label>
        <Input
          id="bgmiId"
          placeholder="5839274108"
          {...form.register("bgmiId")}
        />
        {form.formState.errors.bgmiId && (
          <p className="text-[11px] text-red-400 mt-1">
            {form.formState.errors.bgmiId.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          placeholder="9876543210"
          {...form.register("phone")}
        />
        {form.formState.errors.phone && (
          <p className="text-[11px] text-red-400 mt-1">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save BGMI profile"}
      </Button>
    </form>
  );
}
