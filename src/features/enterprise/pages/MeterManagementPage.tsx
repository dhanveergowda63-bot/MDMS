import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Select from "../../../shared/components/forms/Select";
import MeterTable from "../../../shared/components/meters/MeterTable";
import type { RowAction } from "../../../shared/components/data/DataTable";
import ChartCard from "../../../shared/components/charts/ChartCard";
import ConsumptionChart from "../../../shared/components/charts/ConsumptionChart";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage } from "../../../shared/utils/format";
import type { Meter, MeterStatus } from "../../../shared/types/models";
import {
  getAllMeters,
  getConsumptionByZone,
  getZoneOptions,
} from "../services/meterManagementService";

const CHART_DAYS = 30;

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Deactivated", label: "Deactivated" },
];

export default function MeterManagementPage() {
  const navigate = useNavigate();
  const table = useTableState({
    sort: { field: "id", direction: "asc" },
    filters: { status: "" as MeterStatus | "", zoneId: "" },
  });

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    status: table.filters.status,
    zoneId: table.filters.zoneId,
  };
  const meters = useApi((s) => getAllMeters(params, s), `ent-meters:${JSON.stringify(params)}`);
  const zones = useApi(getZoneOptions, "ent-zone-options");
  const consumption = useApi((s) => getConsumptionByZone(CHART_DAYS, s), `ent-consumption:${CHART_DAYS}`);

  const zoneOptions = (zones.data ?? []).map((z) => ({ value: z.id, label: z.name }));

  const rowActions: RowAction<Meter>[] = [
    { label: "View zone", onClick: (m) => navigate(`/enterprise/zones/${m.zoneId}`) },
  ];

  return (
    <div className="page">
      <PageHeader title="Meter management" subtitle="Meters across all zones" />

      <ChartCard
        title="Consumption by zone"
        subtitle={`Total kWh, last ${CHART_DAYS} days`}
        loading={consumption.loading}
        error={consumption.error ? errorMessage(consumption.error) : undefined}
        empty={(consumption.data ?? []).length === 0}
      >
        <ConsumptionChart
          data={consumption.data ?? []}
          xKey="zone"
          series={[{ key: "kwh", name: "Consumption" }]}
          type="bar"
        />
      </ChartCard>

      <MeterTable
        caption="Meters in all zones"
        showZone
        rows={meters.data?.data ?? []}
        loading={meters.loading}
        error={meters.error ? errorMessage(meters.error) : undefined}
        sort={table.sort}
        onSortChange={table.setSort}
        search={{
          value: table.search,
          onChange: table.setSearch,
          placeholder: "Search by meter ID, owner or zone",
        }}
        toolbar={
          <>
            <Select
              compact
              label="Zone"
              placeholder="All zones"
              options={zoneOptions}
              value={table.filters.zoneId}
              onChange={(e) => table.setFilter("zoneId", e.target.value)}
            />
            <Select
              compact
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              value={table.filters.status}
              onChange={(e) => table.setFilter("status", e.target.value as MeterStatus | "")}
            />
          </>
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: meters.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        rowActions={rowActions}
        emptyMessage="Try another search, zone or status filter."
      />
    </div>
  );
}