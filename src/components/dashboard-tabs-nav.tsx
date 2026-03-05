"use client";

import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DashboardTab = {
  value: string;
  label: string;
  href: string;
};

export function DashboardTabsNav({ tabs }: { tabs: DashboardTab[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = tabs.find((tab) => pathname === tab.href)?.value ?? tabs[0]?.value;

  return (
    <Tabs
      value={active}
      onValueChange={(value) => {
        const next = tabs.find((tab) => tab.value === value);
        if (next) {
          router.push(next.href);
        }
      }}
      className="w-full"
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
