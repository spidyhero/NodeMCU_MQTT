"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createOwnershipProofAction, setModelStatusAction } from "@/app/actions/artist";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function OwnershipProofForm() {
  const [pending, startTransition] = useTransition();
  const [statusPending, setStatusPending] = useState<"DRAFT" | "TRAINING" | "READY" | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const submitProof = () => {
    startTransition(async () => {
      const response = await createOwnershipProofAction(
        files.map((file) => ({
          name: file.name,
          size: file.size,
        })),
      );
      if (!response.ok) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    });
  };

  const changeModelStatus = async (nextStatus: "DRAFT" | "TRAINING" | "READY") => {
    setStatusPending(nextStatus);
    const result = await setModelStatusAction(nextStatus);
    if (!result.ok) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
    setStatusPending(null);
  };

  return (
    <div className="space-y-5 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="space-y-2">
        <Label htmlFor="dataset">Dataset upload (5-20 files)</Label>
        <input
          id="dataset"
          multiple
          type="file"
          accept="image/*"
          onChange={(event) => {
            setFiles(Array.from(event.target.files ?? []));
          }}
          className="block w-full rounded-md border border-zinc-200 p-2 text-sm"
        />
        <p className="text-xs text-zinc-500">Hash is generated from filenames + sizes for proof placeholder.</p>
      </div>
      <Button disabled={pending} onClick={submitProof} type="button">
        {pending ? "Generating proof..." : "Verify ownership"}
      </Button>
      <div className="space-y-2">
        <p className="text-sm font-medium">Model status controls</p>
        <div className="flex flex-wrap gap-2">
          {(["DRAFT", "TRAINING", "READY"] as const).map((state) => (
            <Button
              key={state}
              type="button"
              variant={state === "READY" ? "default" : "outline"}
              disabled={statusPending === state}
              onClick={() => changeModelStatus(state)}
            >
              {statusPending === state ? "Updating..." : state}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
