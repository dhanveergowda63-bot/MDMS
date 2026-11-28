import { useState } from "react";
import Select from "../../../shared/components/forms/Select";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column, RowAction } from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage } from "../../../shared/utils/format";
import type { User, UserRole, UserStatus, Zone } from "../../../shared/types/models";
import { getUsersByRole } from "../services/userManagementService";
import { roleLabels } from "../utils/userLabels";
import UserDetailsModal from "./UserDetailsModal";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Deactivated", label: "Deactivated" },
];

interface UsersTabProps {
  roles: UserRole[];
  zones: Zone[];
  caption: string;
}

export default function UsersTab({ roles, zones, caption }: UsersTabProps) {
  const table = useTableState({
    sort: { field: "name", direction: "asc" },
    filters: { status: "" as UserStatus | "", zoneId: "" },
  });
  const [selected, setSelected] = useState<User | null>(null);

  const zoneName = (zoneId: string | null) =>
    zoneId ? (zones.find((z) => z.id === zoneId)?.name ?? zoneId) : "All zones";

  const params = {
    roles,
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    status: table.filters.status,
    zoneId: table.filters.zoneId,
  };
  const users = useApi((s) => getUsersByRole(params, s), `ent-users:${JSON.stringify(params)}`);

  const columns: Column<User>[] = [
    { key: "id", header: "ID", sortable: true, render: (u) => <strong>{u.id}</strong> },
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Role", sortable: true, render: (u) => roleLabels[u.role] },
    { key: "zoneId", header: "Zone", sortable: true, render: (u) => zoneName(u.zoneId) },
    { key: "status", header: "Status", sortable: true, render: (u) => <StatusBadge status={u.status} /> },
  ];

  const rowActions: RowAction<User>[] = [{ label: "View details", onClick: setSelected }];

  return (
    <>
      <DataTable
        caption={caption}
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
          <>
            <Select
              compact
              label="Zone"
              placeholder="All zones"
              options={zones.map((z) => ({ value: z.id, label: z.name }))}
              value={table.filters.zoneId}
              onChange={(e) => table.setFilter("zoneId", e.target.value)}
            />
            <Select
              compact
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              value={table.filters.status}
              onChange={(e) => table.setFilter("status", e.target.value as UserStatus | "")}
            />
          </>
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: users.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        rowActions={rowActions}
        emptyTitle="No users found"
        emptyMessage="Try another search, zone or status filter."
      />
      <UserDetailsModal
        user={selected}
        zoneName={zoneName(selected?.zoneId ?? null)}
        onClose={() => setSelected(null)}
      />
    </>
  );
}