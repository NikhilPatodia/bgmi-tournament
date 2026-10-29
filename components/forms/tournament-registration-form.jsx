"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tournamentRegistrationSchema } from "@/lib/validations/forms";
import { membersForMode } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UpiQrBox } from "@/components/modules/payments/upi-qr-box";

export function TournamentRegistrationForm({
  tournament,
  slotNumber,
  defaultCaptain,
  onSubmit,
  isSubmitting,
}) {
  const count = membersForMode(tournament.mode);

  const form = useForm({
    resolver: zodResolver(tournamentRegistrationSchema),
    defaultValues: {
      slotNumber,
      teamName: "",
      acceptRules: false,
      paymentUtr: "",
      paymentProof: "",
      members: Array.from({ length: count }, (_, i) => ({
        ign: i === 0 ? defaultCaptain?.bgmiIgn || "" : "",
        bgmiId: i === 0 ? defaultCaptain?.bgmiId || "" : "",
        isCaptain: i === 0,
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "members",
  });

  useEffect(() => {
    form.setValue("slotNumber", slotNumber);
  }, [slotNumber, form]);

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit((values) => onSubmit(values))}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Selected slot</Label>
          <Input value={`#${slotNumber}`} readOnly />
        </div>
        {tournament.mode !== "SOLO" && (
          <div>
            <Label htmlFor="teamName">Team name</Label>
            <Input id="teamName" {...form.register("teamName")} placeholder="e.g. Nova Vanguard" />
            {form.formState.errors.teamName && (
              <p className="text-[11px] text-red-400 mt-1">
                {form.formState.errors.teamName.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="nf-label">Roster ({count} {tournament.mode.toLowerCase()})</p>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid sm:grid-cols-2 gap-3 rounded-lg border border-[#1a2433] bg-[#0a1018] p-3"
          >
            <div>
              <Label htmlFor={`members.${index}.ign`}>
                {index === 0 ? "Captain IGN" : `Player ${index + 1} IGN`}
              </Label>
              <Input
                id={`members.${index}.ign`}
                {...form.register(`members.${index}.ign`)}
                placeholder="In-game name"
              />
            </div>
            <div>
              <Label htmlFor={`members.${index}.bgmiId`}>Character ID</Label>
              <Input
                id={`members.${index}.bgmiId`}
                {...form.register(`members.${index}.bgmiId`)}
                placeholder="10-digit BGMI ID"
              />
            </div>
          </div>
        ))}
        {form.formState.errors.members?.root && (
          <p className="text-[11px] text-red-400">
            {form.formState.errors.members.root.message}
          </p>
        )}
      </div>

      {tournament.entryFee > 0 && (
        <div className="space-y-3">
          <UpiQrBox
            amount={tournament.entryFee}
            note={`${tournament.title} slot ${slotNumber || ""}`.trim()}
          />
          <div>
            <Label htmlFor="paymentUtr">UPI transaction ID / UTR</Label>
            <Input id="paymentUtr" placeholder="12-digit UTR" {...form.register("paymentUtr")} />
          </div>
          <div>
            <Label htmlFor="paymentProof">Payment screenshot</Label>
            <Input
              id="paymentProof"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 1_500_000) {
                  form.setError("paymentProof", { message: "Screenshot must be under 1.5 MB" });
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => form.setValue("paymentProof", String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
            />
            {form.formState.errors.paymentProof && (
              <p className="text-[11px] text-red-400 mt-1">
                {form.formState.errors.paymentProof.message}
              </p>
            )}
          </div>
        </div>
      )}

      <label className="flex items-start gap-2 text-xs text-slate-400">
        <input
          type="checkbox"
          className="mt-0.5 accent-amber-500"
          {...form.register("acceptRules")}
        />
        <span>
          I accept the match rules, emulator bans, and eligibility requirements.
        </span>
      </label>
      {form.formState.errors.acceptRules && (
        <p className="text-[11px] text-red-400">
          {form.formState.errors.acceptRules.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting || !slotNumber}>
        {isSubmitting
          ? "Locking slot…"
          : tournament.entryFee > 0
            ? "Submit payment proof & hold slot"
            : "Confirm free registration"}
      </Button>
    </form>
  );
}
