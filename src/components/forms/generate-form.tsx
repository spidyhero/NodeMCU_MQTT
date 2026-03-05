"use client";

import { LicenseType } from "@prisma/client";
import Image from "next/image";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { generateImageAction } from "@/app/actions/buyer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateSchema } from "@/lib/validations";

const clientSchema = generateSchema.extend({
  negativePrompt: z.string().optional(),
});

type GenerateValues = z.infer<typeof clientSchema>;

export function GenerateForm({
  artistSlug,
  artistName,
}: {
  artistSlug: string;
  artistName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ imageUrl: string; jobId: string } | null>(null);

  const form = useForm<GenerateValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      artistSlug,
      prompt: "",
      negativePrompt: "",
      licenseType: LicenseType.STANDARD,
    },
  });

  const onSubmit = (values: GenerateValues) => {
    startTransition(async () => {
      const response = await generateImageAction(values);
      if (!response.ok || !response.data) {
        toast.error(response.message);
        return;
      }
      setResult(response.data);
      toast.success(response.message);
      form.reset({ ...values, prompt: "", negativePrompt: "" });
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
        <input type="hidden" value={artistSlug} {...form.register("artistSlug")} />
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder={`Describe your concept with ${artistName}'s style`}
            {...form.register("prompt")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="negativePrompt">Negative prompt (optional)</Label>
          <Input id="negativePrompt" placeholder="low quality, watermark text..." {...form.register("negativePrompt")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseType">License</Label>
          <select
            id="licenseType"
            {...form.register("licenseType")}
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#51E674]"
          >
            <option value={LicenseType.STANDARD}>Standard</option>
            <option value={LicenseType.COMMERCIAL}>Commercial</option>
          </select>
        </div>
        <Button disabled={pending} type="submit">
          {pending ? "Generating..." : "Generate (1 credit)"}
        </Button>
      </form>

      {result ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated result</h3>
            <Badge variant="success">Ownership metadata attached</Badge>
          </div>
          <Image
            src={result.imageUrl}
            alt="Generated output"
            width={1024}
            height={1024}
            className="aspect-square w-full rounded-md object-cover"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">Job ID: {result.jobId}</Badge>
            <a href={result.imageUrl} download className="text-sm font-medium text-zinc-700 underline">
              Download image
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View license note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>License receipt preview</DialogTitle>
                  <DialogDescription>
                    This generation automatically issues a license receipt and logs ownership metadata.
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-zinc-700">
                  Every output includes watermark + fingerprint placeholders, model version reference, and audit trail data.
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
          No generations yet. Submit a prompt to create your first result.
        </p>
      )}
    </div>
  );
}
