import { notFound } from "next/navigation";

import { GenerateForm } from "@/components/forms/generate-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type GeneratePageProps = {
  params: Promise<{ artistSlug: string }>;
};

export default async function GeneratePage({ params }: GeneratePageProps) {
  await requireUser("BUYER");
  const { artistSlug } = await params;

  const artist = await prisma.artistProfile.findUnique({
    where: { slug: artistSlug },
    include: {
      user: {
        include: {
          artistModels: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          ownershipProof: true,
        },
      },
    },
  });

  if (!artist) {
    notFound();
  }

  const model = artist.user.artistModels[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Use Artist Model</CardTitle>
          <CardDescription>Generate premium campaign visuals with ethical licensing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-lg font-semibold">{artist.displayName}</p>
          <p className="text-zinc-600">{artist.bio}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Model {model?.version ?? "v0.1"}</Badge>
            <Badge variant={artist.user.ownershipProof ? "success" : "outline"}>
              {artist.user.ownershipProof ? "Ownership verified" : "Ownership pending"}
            </Badge>
          </div>
          <p>Cost per generation: {formatCredits(100)}</p>
          <p>Revenue split: 70% artist / 30% platform</p>
        </CardContent>
      </Card>
      <GenerateForm artistSlug={artist.slug} artistName={artist.displayName} />
    </div>
  );
}
