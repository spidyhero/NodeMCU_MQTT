import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function ArtistDashboardPage() {
  const session = await requireUser("ARTIST");

  const [artworksCount, latestModel, proof, earningsAggregate, recentJobs] = await Promise.all([
    prisma.artwork.count({
      where: { artistId: session.id },
    }),
    prisma.model.findFirst({
      where: { artistId: session.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ownershipProof.findUnique({
      where: { artistId: session.id },
    }),
    prisma.revenueSplit.aggregate({
      _sum: { artistShareInt: true },
      where: {
        transaction: {
          artistId: session.id,
        },
      },
    }),
    prisma.generationJob.findMany({
      where: { artistId: session.id, status: "DONE" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { buyer: true },
    }),
  ]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total earnings</CardDescription>
            <CardTitle>{formatCredits(earningsAggregate._sum.artistShareInt ?? 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Storefront artworks</CardDescription>
            <CardTitle>{artworksCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Model + ownership</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base">
              <Badge variant="secondary">{latestModel?.status ?? "DRAFT"}</Badge>
              <Badge variant={proof ? "success" : "outline"}>{proof ? "Verified" : "Pending"}</Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent buyer generations</CardTitle>
          <CardDescription>Latest jobs made using your model.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentJobs.length === 0 ? (
            <p className="text-sm text-zinc-500">No generation jobs yet.</p>
          ) : (
            recentJobs.map((job) => (
              <div key={job.id} className="rounded-md border border-zinc-200 p-3 text-sm">
                <p className="font-medium">Buyer: {job.buyer.name}</p>
                <p className="line-clamp-2 text-zinc-600">{job.prompt}</p>
              </div>
            ))
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard/artist/earnings">View full earnings ledger</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
