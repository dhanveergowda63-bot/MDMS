import Select from "../../../shared/components/forms/Select";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column } from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage } from "../../../shared/utils/format";
import type { User, UserStatus } from "../../../shared/types/models";
import { getCustomersOfZone } from "../services/zoneDetailService";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Deactivated", label: "Deactivated" },
];

const columns: Column<User>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    render: (u) => <strong>{u.id}</strong>,
  },
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", sortable: true },
  { key: "phone", header: "Phone" },
  {
    key: "meterCount",
    header: "Meters",
    sortable: true,
    align: "right",
    render: (u) => u.meterCount ?? 0,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (u) => <StatusBadge status={u.status} />,
  },
];

export default function ZoneUsersTab({ zoneId }: { zoneId: string }) {
  const table = useTableState({
    sort: { field: "name", direction: "asc" },
    filters: { status: "" as UserStatus | "" },
  });

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    status: table.filters.status,
  };
  const users = useApi(
    (s) => getCustomersOfZone(zoneId, params, s),
    `zone-users:${zoneId}:${JSON.stringify(params)}`,
  );

  return (
    <DataTable
      caption="Customers in this zone"
      columns={columns}
      rows={users.data?.data ?? []}
      rowKey={(u) => u.id}
      loading={users.loading}
      error={users.error ? errorMessage(users.error) : undefined}
      sort={table.sort}
      onSortChange={table.setSort}
      search={{
        value: table.search,
        onChange: table.setSearch,
        placeholder: "Search by ID, name, email or phone",
      }}
      toolbar={
        <Select
          compact
          label="Status"
          placeholder="All statuses"
          options={statusOptions}
          value={table.filters.status}
          onChange={(e) =>
            table.setFilter("status", e.target.value as UserStatus | "")
          }
        />
      }
      pagination={{
        page: table.page,
        pageSize: table.pageSize,
        total: users.data?.items ?? 0,
        onPageChange: table.setPage,
      }}
      emptyTitle="No customers found"
      emptyMessage="Try another search or status filter."
    />
  );
}
