import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type ArtworkPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArtworkDetailPage({ params }: ArtworkPageProps) {
  const { id } = await params;
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: {
      artist: {
        include: {
          artistProfile: true,
        },
      },
    },
  });

  if (!artwork) {
    notFound();
  }

  const tags = (artwork.tags as string[] | null) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Image
        src={artwork.imageUrl}
        alt={artwork.title}
        width={1200}
        height={1200}
        className="aspect-square w-full rounded-2xl border border-zinc-200 object-cover"
      />
      <Card>
        <CardHeader>
          <div className="mb-2 flex gap-2">
            <Badge variant="secondary">Artwork listing</Badge>
            {artwork.isForSale ? <Badge variant="success">For sale</Badge> : <Badge variant="outline">Not for sale</Badge>}
          </div>
          <CardTitle>{artwork.title}</CardTitle>
          <p className="text-sm text-zinc-500">
            by {artwork.artist.artistProfile?.displayName ?? artwork.artist.name}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-700">{artwork.description}</p>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
          {artwork.isForSale && artwork.price ? (
            <p className="text-lg font-semibold">{formatCredits(artwork.price)}</p>
          ) : null}
          <div className="flex gap-2">
            <Button disabled={!artwork.isForSale}>Purchase (MVP placeholder)</Button>
            <Button variant="outline" asChild>
              <Link href={`/artist/${artwork.artist.artistProfile?.slug ?? ""}`}>View artist storefront</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
