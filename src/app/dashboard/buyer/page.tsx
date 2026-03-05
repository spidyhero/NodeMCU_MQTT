import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function BuyerDashboardPage() {
  const session = await requireUser("BUYER");

  const [wallet, jobs, receipts] = await Promise.all([
    prisma.creditWallet.findUnique({ where: { userId: session.id } }),
    prisma.generationJob.findMany({
      where: { buyerId: session.id },
      include: {
        artist: {
          include: {
            artistProfile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.licenseReceipt.findMany({
      where: { buyerId: session.id },
      orderBy: { issuedAt: "desc" },
      take: 5,
      include: {
        artist: {
          include: {
            artistProfile: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Credit wallet</CardDescription>
            <CardTitle>{formatCredits(wallet?.balanceInt ?? 0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/buyer/credits">Top up credits</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Recent receipts</CardDescription>
            <CardTitle>{receipts.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">Each generation automatically creates a license receipt.</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent generations</CardTitle>
          <CardDescription>Download outputs and review ownership metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-sm text-zinc-500">No generation history yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div key={job.id} className="space-y-2 rounded-lg border border-zinc-200 p-2">
                  <Image
                    src={job.outputImageUrl ?? "/mock-results/result-1.svg"}
                    alt="Generated output"
                    width={600}
                    height={600}
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <p className="line-clamp-2 text-sm">{job.prompt}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.artist.artistProfile?.displayName ?? job.artist.name}</Badge>
                    <Badge variant="success">{job.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>License receipts</CardTitle>
          <CardDescription>Issued per generation with selected usage terms.</CardDescription>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <p className="text-sm text-zinc-500">No receipts yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Terms</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>{new Date(receipt.issuedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{receipt.artist.artistProfile?.displayName ?? receipt.artist.name}</TableCell>
                    <TableCell>{receipt.licenseType}</TableCell>
                    <TableCell className="max-w-[360px] truncate">{receipt.termsText}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
