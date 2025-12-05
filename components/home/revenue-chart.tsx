"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Mock data for Income vs Expenses
const chartData = [
  { month: "Jan 2024", income: 2100000, expenses: 180000 },
  { month: "Fév 2024", income: 2250000, expenses: 220000 },
  { month: "Mar 2024", income: 2180000, expenses: 150000 },
  { month: "Avr 2024", income: 2400000, expenses: 280000 },
  { month: "Mai 2024", income: 2350000, expenses: 190000 },
  { month: "Juin 2024", income: 2500000, expenses: 210000 },
  { month: "Juil 2024", income: 2450000, expenses: 185000 },
]

const chartConfig = {
  income: {
    label: "Revenus",
    color: "hsl(152, 57%, 48%)",
  },
  expenses: {
    label: "Dépenses",
    color: "hsl(220, 70%, 55%)",
  },
} satisfies ChartConfig

export function RevenueChart() {
  const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0)
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Statistiques Financières
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Dépenses</span>
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome)} FCFA
          </span>
          <span className="text-muted-foreground text-sm">revenus totaux</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 57%, 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 57%, 48%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => {
                const parts = value.split(" ")
                return parts[0].substring(0, 3)
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value, name) => [
                    `${formatCurrency(value as number)} FCFA`,
                    name === "income" ? "Revenus" : "Dépenses"
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(152, 57%, 48%)"
              strokeWidth={2}
              fill="url(#fillIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(220, 70%, 55%)"
              strokeWidth={2}
              fill="url(#fillExpenses)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

