import { DashboardTabsNav } from "@/components/dashboard-tabs-nav";
import { requireUser } from "@/lib/auth";

export default async function ArtistDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireUser("ARTIST");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Artist Dashboard</h1>
        <p className="text-zinc-600">Manage your model, storefront, and revenue.</p>
      </div>
      <DashboardTabsNav
        tabs={[
          { value: "overview", label: "Overview", href: "/dashboard/artist" },
          { value: "artworks", label: "Artworks", href: "/dashboard/artist/artworks" },
          { value: "model", label: "Model", href: "/dashboard/artist/model" },
          { value: "earnings", label: "Earnings", href: "/dashboard/artist/earnings" },
        ]}
      />
      {children}
    </div>
  );
}
