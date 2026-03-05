"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { buyCreditsAction } from "@/app/actions/buyer";
import { Button } from "@/components/ui/button";

export function BuyCreditsButton({ credits = 50 }: { credits?: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await buyCreditsAction(credits);
          if (!result.ok) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
        });
      }}
      type="button"
    >
      {pending ? "Processing..." : `Buy ${credits} credits`}
    </Button>
  );
}
