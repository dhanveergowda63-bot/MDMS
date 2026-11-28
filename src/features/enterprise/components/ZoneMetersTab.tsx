import Select from "../../../shared/components/forms/Select";
import MeterTable from "../../../shared/components/meters/MeterTable";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage } from "../../../shared/utils/format";
import type { MeterStatus } from "../../../shared/types/models";
import { getMetersOfZone } from "../services/zoneDetailService";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Deactivated", label: "Deactivated" },
];

export default function ZoneMetersTab({ zoneId }: { zoneId: string }) {
  const table = useTableState({
    sort: { field: "id", direction: "asc" },
    filters: { status: "" as MeterStatus | "" },
  });

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    status: table.filters.status,
  };
  const meters = useApi(
    (s) => getMetersOfZone(zoneId, params, s),
    `zone-meters:${zoneId}:${JSON.stringify(params)}`,
  );

  return (
    <MeterTable
      caption="Meters in this zone"
      rows={meters.data?.data ?? []}
      loading={meters.loading}
      error={meters.error ? errorMessage(meters.error) : undefined}
      sort={table.sort}
      onSortChange={table.setSort}
      search={{
        value: table.search,
        onChange: table.setSearch,
        placeholder: "Search by meter ID or owner",
      }}
      toolbar={
        <Select
          compact
          label="Status"
          placeholder="All statuses"
          options={statusOptions}
          value={table.filters.status}
          onChange={(e) =>
            table.setFilter("status", e.target.value as MeterStatus | "")
          }
        />
      }
      pagination={{
        page: table.page,
        pageSize: table.pageSize,
        total: meters.data?.items ?? 0,
        onPageChange: table.setPage,
      }}
      emptyMessage="Try another search or status filter."
    />
  );
}
