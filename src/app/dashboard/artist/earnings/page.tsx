import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function ArtistEarningsPage() {
  const session = await requireUser("ARTIST");
  const [splits, total] = await Promise.all([
    prisma.revenueSplit.findMany({
      where: {
        transaction: {
          artistId: session.id,
          type: "GENERATION_FEE",
        },
      },
      include: {
        transaction: {
          include: {
            buyer: true,
            job: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.revenueSplit.aggregate({
      where: {
        transaction: {
          artistId: session.id,
          type: "GENERATION_FEE",
        },
      },
      _sum: {
        artistShareInt: true,
        platformShareInt: true,
        buyerCostInt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Artist share</CardDescription>
            <CardTitle>{formatCredits(total._sum.artistShareInt ?? 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Platform share</CardDescription>
            <CardTitle>{formatCredits(total._sum.platformShareInt ?? 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total buyer spend</CardDescription>
            <CardTitle>{formatCredits(total._sum.buyerCostInt ?? 0)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue ledger</CardTitle>
          <CardDescription>Automatic split logs for each generation transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          {splits.length === 0 ? (
            <p className="text-sm text-zinc-500">No earnings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Buyer cost</TableHead>
                  <TableHead>Artist share</TableHead>
                  <TableHead>Platform share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {splits.map((split) => (
                  <TableRow key={split.id}>
                    <TableCell>{new Date(split.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{split.transaction.buyer.name}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{split.transaction.job?.prompt ?? "-"}</TableCell>
                    <TableCell>{formatCredits(split.buyerCostInt)}</TableCell>
                    <TableCell>{formatCredits(split.artistShareInt)}</TableCell>
                    <TableCell>{formatCredits(split.platformShareInt)}</TableCell>
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
