import { OwnershipProofForm } from "@/components/forms/ownership-proof-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ArtistModelPage() {
  const session = await requireUser("ARTIST");

  const [model, proof] = await Promise.all([
    prisma.model.findFirst({
      where: { artistId: session.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ownershipProof.findUnique({
      where: { artistId: session.id },
    }),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Model settings</CardTitle>
          <CardDescription>Training/fine-tuning controls (MVP placeholders).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{model?.name ?? "No model configured"}</Badge>
            <Badge variant="outline">{model?.baseModel ?? "FLUX"}</Badge>
          </div>
          <p>Status: {model?.status ?? "DRAFT"}</p>
          <p>Version: {model?.version ?? "v0.1"}</p>
          <p>Lora config: {JSON.stringify(model?.loraConfig ?? {}, null, 0)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ownership & ethical layer</CardTitle>
          <CardDescription>Upload dataset and generate ownership proof metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <OwnershipProofForm />
          {proof ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
              <p className="font-semibold">Ownership verified</p>
              <p>Dataset hash: {proof.datasetHash.slice(0, 24)}...</p>
              <p>Watermark key: {proof.watermarkKey}</p>
              <p>Fingerprint key: {proof.fingerprintKey}</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No ownership proof yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
