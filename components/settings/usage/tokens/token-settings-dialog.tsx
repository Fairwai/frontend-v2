"use client";

import { useState } from "react";
import { AutoRefillTokenForm } from "@/components/settings/usage/tokens/auto-refill-token-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePlans } from "@/hooks/use-plans";
import type { UsageStats } from "@/lib/schemas/settings";

interface TokenSettingsDialogProps {
  children: React.ReactNode;
  usageStats: UsageStats;
}

export function TokenSettingsDialog({
  children,
  usageStats,
}: TokenSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { tokenPacks, tokenPacksLoading } = usePlans();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Token Settings</DialogTitle>
          <DialogDescription>
            Configure auto-refill when your token balance drops below a
            threshold.
          </DialogDescription>
        </DialogHeader>

        <AutoRefillTokenForm
          usageStats={usageStats}
          tokenPacks={tokenPacks}
          tokenPacksLoading={tokenPacksLoading}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
