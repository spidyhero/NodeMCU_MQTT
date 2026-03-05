import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-12">
        <Badge variant="success" className="mb-4">
          Thailand-first ethical AI image platform
        </Badge>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Artist-owned AI models for brands, agencies, and creators.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          THAREEA AI helps Thai artists train and monetize their own style models with transparent licensing,
          ownership proof, and built-in revenue split.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/marketplace">Explore marketplace</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Join as artist or buyer</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Artist storefronts</CardTitle>
            <CardDescription>Own your model, portfolio, and licensing terms.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">Showcase artworks, verify dataset ownership, and track earnings.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Buyer generation flow</CardTitle>
            <CardDescription>Use an artist model in one click.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">
            Prompt-based generation with watermark and fingerprint metadata logging.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transparent split ledger</CardTitle>
            <CardDescription>70% artist / 30% platform by default.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">
            Automatic revenue entries for every generation event and downloadable receipts.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
