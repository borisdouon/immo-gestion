"use client"

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { KpiCards } from "@/components/home/kpi-cards";
import { ChartSkeleton, TableSkeleton } from "@/components/ui/table-skeleton";

// Lazy load heavy components with code splitting
const RevenueChart = dynamic(() => import("@/components/home/revenue-chart").then(mod => ({ default: mod.RevenueChart })), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Charts are client-only
});

const ActivityFeed = dynamic(() => import("@/components/home/activity-feed").then(mod => ({ default: mod.ActivityFeed })), {
  loading: () => <div className="space-y-3"><div className="h-4 w-full bg-muted animate-pulse rounded" /><div className="h-4 w-3/4 bg-muted animate-pulse rounded" /></div>,
  ssr: false,
});

const PropertyTransactions = dynamic(() => import("@/components/home/property-transactions").then(mod => ({ default: mod.PropertyTransactions })), {
  loading: () => <TableSkeleton rows={8} cols={6} />,
  ssr: false, // Large table component
});

export default function Page() {
  return (
    <div className="flex flex-1 flex-col" suppressHydrationWarning>
      {/* Header Section */}
      <DashboardHeader userName="Admin" />
      
      <div className="flex flex-1 flex-col gap-4 sm:gap-6 px-4 pb-4 sm:pb-6 lg:px-6">
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Left Column - KPI Cards (Vertical Stack) */}
          <div className="lg:col-span-3">
            <KpiCards 
              totalProperties={12}
              totalRevenue={2450000}
              maintenanceCost={185000}
              propertiesChange={8}
              revenueChange={20}
              maintenanceChange={-15}
            />
          </div>
          
          {/* Center Column - Revenue Chart */}
          <div className="lg:col-span-5">
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueChart />
            </Suspense>
          </div>
          
          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-4">
            <Suspense fallback={<div className="space-y-3"><div className="h-4 w-full bg-muted animate-pulse rounded" /></div>}>
              <ActivityFeed />
            </Suspense>
          </div>
        </div>

        {/* Bottom Section - Property Transactions Table */}
        <Suspense fallback={<TableSkeleton rows={8} cols={6} />}>
          <PropertyTransactions />
        </Suspense>
      </div>
    </div>
  );
}
