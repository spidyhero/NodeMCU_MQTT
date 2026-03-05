import Image from "next/image";

import { ArtworkUploadForm } from "@/components/forms/artwork-upload-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function ArtistArtworksPage() {
  const session = await requireUser("ARTIST");
  const artworks = await prisma.artwork.findMany({
    where: { artistId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Upload artwork</CardTitle>
            <CardDescription>Add new pieces to your storefront gallery.</CardDescription>
          </CardHeader>
          <CardContent>
            <ArtworkUploadForm />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-3">
        {artworks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-sm text-zinc-500">
            No artworks uploaded yet.
          </p>
        ) : (
          artworks.map((artwork) => (
            <div key={artwork.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                width={140}
                height={140}
                className="h-24 w-24 rounded-md object-cover"
              />
              <div className="space-y-1">
                <p className="font-medium">{artwork.title}</p>
                <p className="line-clamp-2 text-sm text-zinc-600">{artwork.description}</p>
                <div className="flex gap-2">
                  {artwork.isForSale ? <Badge variant="success">For sale</Badge> : <Badge variant="outline">Showcase only</Badge>}
                  {artwork.price ? <Badge variant="secondary">{formatCredits(artwork.price)}</Badge> : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
