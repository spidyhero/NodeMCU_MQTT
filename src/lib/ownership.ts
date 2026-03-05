import crypto from "node:crypto";

export function buildDatasetHash(files: Array<{ name: string; size: number }>) {
  const normalized = files
    .map((file) => `${file.name}:${file.size}`)
    .sort()
    .join("|");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
