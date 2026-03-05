import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type MarketplacePageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const artists = await prisma.artistProfile.findMany({
    where: query
      ? {
          OR: [
            { displayName: { contains: query } },
            { bio: { contains: query } },
            { slug: { contains: query } },
          ],
        }
      : undefined,
    include: {
      user: {
        include: {
          ownershipProof: true,
          artistArtworks: true,
          artistModels: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Marketplace</h1>
          <p className="text-zinc-600">Discover artist-owned models available for ethical licensing.</p>
        </div>
        <form className="flex w-full max-w-md gap-2">
          <input
            defaultValue={query}
            name="q"
            placeholder="Search artist, style, or slug"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {artists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-sm text-zinc-500">
          No artists found. Try another keyword.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artists.map((artist) => {
            const latestModel = artist.user.artistModels[0];
            return (
              <Card key={artist.id}>
                <CardHeader>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{latestModel?.baseModel ?? "N/A"}</Badge>
                    <Badge variant={artist.user.ownershipProof ? "success" : "outline"}>
                      {artist.user.ownershipProof ? "Ownership verified" : "Ownership pending"}
                    </Badge>
                  </div>
                  <CardTitle>{artist.displayName}</CardTitle>
                  <CardDescription>@{artist.slug}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-zinc-600">
                  <p className="line-clamp-2">{artist.bio}</p>
                  <p>{artist.user.artistArtworks.length} artworks</p>
                  <p>Model status: {latestModel?.status ?? "Not set"}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/artist/${artist.slug}`}>Storefront</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/generate/${artist.slug}`}>Use model</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
