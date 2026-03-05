import { DashboardTabsNav } from "@/components/dashboard-tabs-nav";
import { requireUser } from "@/lib/auth";

export default async function BuyerDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireUser("BUYER");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Buyer Dashboard</h1>
        <p className="text-zinc-600">Manage your credits, generations, and receipts.</p>
      </div>
      <DashboardTabsNav
        tabs={[
          { value: "overview", label: "Overview", href: "/dashboard/buyer" },
          { value: "credits", label: "Credits", href: "/dashboard/buyer/credits" },
        ]}
      />
      {children}
    </div>
  );
}
