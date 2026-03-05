import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type ArtistStorefrontProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArtistStorefrontPage({ params }: ArtistStorefrontProps) {
  const { slug } = await params;
  const artist = await prisma.artistProfile.findUnique({
    where: { slug },
    include: {
      user: {
        include: {
          artistArtworks: {
            orderBy: { createdAt: "desc" },
          },
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
  const socialLinks = artist.socialLinks as { instagram?: string; website?: string } | null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant={artist.user.ownershipProof ? "success" : "outline"}>
                {artist.user.ownershipProof ? "Ownership Verified" : "Ownership Pending"}
              </Badge>
              <Badge variant="secondary">Model {model?.status ?? "DRAFT"}</Badge>
            </div>
            <h1 className="text-3xl font-semibold">{artist.displayName}</h1>
            <p className="mt-2 max-w-2xl text-zinc-600">{artist.bio}</p>
            <div className="mt-2 text-sm text-zinc-500">
              {socialLinks?.instagram ? <span>IG: {socialLinks.instagram}</span> : null}
            </div>
          </div>
          <Button asChild>
            <Link href={`/generate/${artist.slug}`}>Use this model</Link>
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Licensing information</CardTitle>
          <CardDescription>Standard and commercial options available per generation job.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600">
          <ul className="list-disc space-y-1 pl-5">
            <li>Every output includes ownership metadata placeholders and fingerprint IDs.</li>
            <li>Artist receives 70% of generation fee automatically.</li>
            <li>License receipt is issued for each generation event.</li>
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        {artist.user.artistArtworks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
            No artworks yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artist.user.artistArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/artwork/${artwork.id}`}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-sm"
              >
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={900}
                  height={900}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-medium">{artwork.title}</p>
                  <p className="line-clamp-2 text-sm text-zinc-600">{artwork.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
