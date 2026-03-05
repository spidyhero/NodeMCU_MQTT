"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createArtworkAction } from "@/app/actions/artist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const clientArtworkSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(800),
  imageUrl: z.string().url(),
  tags: z.string().optional(),
  priceCredits: z.string().optional(),
  isForSale: z.boolean().optional(),
});

type ArtworkValues = z.output<typeof clientArtworkSchema>;

export function ArtworkUploadForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<ArtworkValues>({
    resolver: zodResolver(clientArtworkSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      tags: "",
      isForSale: false,
    },
  });
  const isForSale = useWatch({ control: form.control, name: "isForSale" });

  const onSubmit = (values: ArtworkValues) => {
    startTransition(async () => {
      const result = await createArtworkAction({
        ...values,
        isForSale: Boolean(values.isForSale),
        priceCredits:
          values.priceCredits && values.priceCredits.trim().length > 0
            ? Number.parseFloat(values.priceCredits)
            : undefined,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.reset();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" placeholder="https://..." {...form.register("imageUrl")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" placeholder="portrait, thai-art, cinematic" {...form.register("tags")} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isForSale" {...form.register("isForSale")} />
        <Label htmlFor="isForSale">List for sale</Label>
      </div>
      {isForSale ? (
        <div className="space-y-2">
          <Label htmlFor="priceCredits">Price (credits)</Label>
          <Input id="priceCredits" type="number" step="0.1" {...form.register("priceCredits")} />
        </div>
      ) : null}
      <Button disabled={pending} type="submit">
        {pending ? "Uploading..." : "Upload artwork"}
      </Button>
    </form>
  );
}
