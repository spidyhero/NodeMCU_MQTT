import { BuyCreditsButton } from "@/components/forms/buy-credits-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCredits } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function BuyerCreditsPage() {
  const session = await requireUser("BUYER");
  const [wallet, transactions] = await Promise.all([
    prisma.creditWallet.findUnique({
      where: { userId: session.id },
    }),
    prisma.transaction.findMany({
      where: { buyerId: session.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Credit Wallet</CardTitle>
          <CardDescription>Simulated purchases for MVP checkout flow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-semibold">{formatCredits(wallet?.balanceInt ?? 0)}</p>
          <div className="flex flex-wrap gap-2">
            <BuyCreditsButton credits={50} />
            <BuyCreditsButton credits={100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
          <CardDescription>Credit purchases and generation fee deductions.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-zinc-500">No transactions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{formatCredits(transaction.amountInt)}</TableCell>
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
