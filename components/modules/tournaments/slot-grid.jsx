"use client";

import { SlotCard } from "@/components/modules/tournaments/slot-card";

export function SlotGrid({
  maxSlots = 25,
  registrations = [],
  selectedSlot,
  onSelect,
  locked = false,
}) {
  const bySlot = new Map(registrations.map((r) => [r.slotNumber, r]));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
      {Array.from({ length: maxSlots }, (_, i) => {
        const slotNumber = i + 1;
        return (
          <SlotCard
            key={slotNumber}
            slotNumber={slotNumber}
            registration={bySlot.get(slotNumber)}
            selected={selectedSlot === slotNumber}
            onSelect={onSelect}
            disabled={locked}
          />
        );
      })}
    </div>
  );
}
