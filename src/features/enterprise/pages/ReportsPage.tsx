import { useState } from "react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Select from "../../../shared/components/forms/Select";
import ChartCard from "../../../shared/components/charts/ChartCard";
import ConsumptionChart from "../../../shared/components/charts/ConsumptionChart";
import { useApi } from "../../../shared/hooks/useApi";
import { errorMessage } from "../../../shared/utils/format";
import { getZoneComparison } from "../services/reportService";
import type { ComparePeriod, ComparisonRow } from "../services/reportService";

const periodOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "4w", label: "Last 4 weeks" },
  { value: "12w", label: "Last 12 weeks" },
];

const subtitles: Record<ComparePeriod, string> = {
  "7d": "Total kWh per day, last 7 days",
  "4w": "Total kWh per week, last 4 weeks (week starting on the date shown)",
  "12w": "Total kWh per week, last 12 weeks (week starting on the date shown)",
};

// Fixed colours that stay readable in both the light and dark theme.
const zoneColors = [
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#0ea5e9",
  "#84cc16",
  "#ec4899",
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<ComparePeriod>("4w");
  const comparison = useApi(
    (s) => getZoneComparison(period, s),
    `ent-compare:${period}`,
  );

  const zones = comparison.data?.zones ?? [];

  return (
    <div className="page">
      <PageHeader
        title="Reports & analytics"
        subtitle="Compare consumption between zones"
      />

      <ChartCard
        title="Consumption by zone"
        subtitle={subtitles[period]}
        height={380}
        loading={comparison.loading}
        error={comparison.error ? errorMessage(comparison.error) : undefined}
        empty={(comparison.data?.rows ?? []).length === 0}
        actions={
          <Select
            compact
            label="Period"
            options={periodOptions}
            value={period}
            onChange={(e) => setPeriod(e.target.value as ComparePeriod)}
          />
        }
      >
        <ConsumptionChart<ComparisonRow>
          data={comparison.data?.rows ?? []}
          xKey="label"
          type="bar"
          series={zones.map((z, i) => ({
            key: z.id,
            name: z.name,
            color: zoneColors[i % zoneColors.length],
          }))}
        />
      </ChartCard>
    </div>
  );
}
