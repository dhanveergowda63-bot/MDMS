import PageHeader from "../../../shared/components/ui/PageHeader";
import Select from "../../../shared/components/forms/Select";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column } from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage, formatDateTime } from "../../../shared/utils/format";
import { roleLabels } from "../utils/userLabels";
import type { UserRole } from "../../../shared/types/models";
import { getAuditLogs, getAuditUsers } from "../services/auditLogManagementService";
import type { AuditLog, AuditStatus } from "../services/auditLogManagementService";

const statusOptions = [
  { value: "Success", label: "Success" },
  { value: "Failed", label: "Failed" },
];

const columns: Column<AuditLog>[] = [
  { key: "id", header: "Log ID", sortable: true, render: (l) => <strong>{l.id}</strong> },
  { key: "timestamp", header: "Timestamp", sortable: true, render: (l) => formatDateTime(l.timestamp) },
  {
    key: "userName",
    header: "User",
    sortable: true,
    render: (l) => (
      <>
        {l.userName} <span className="muted">({roleLabels[l.role as UserRole] ?? l.role})</span>
      </>
    ),
  },
  { key: "action", header: "Action", sortable: true },
  { key: "resource", header: "Resource", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (l) => <StatusBadge status={l.status} /> },
];

export default function AuditLogsPage() {
  const table = useTableState({
    sort: { field: "timestamp", direction: "desc" },
    filters: { userId: "", status: "" as AuditStatus | "", from: "", to: "" },
  });

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    userId: table.filters.userId,
    status: table.filters.status,
    from: table.filters.from,
    to: table.filters.to,
  };
  const logs = useApi((s) => getAuditLogs(params, s), `ent-audit:${JSON.stringify(params)}`);
  const users = useApi(getAuditUsers, "ent-audit-users");

  return (
    <div className="page">
      <PageHeader title="Audit logs" subtitle="Who did what, across all zones" />
      <DataTable
        caption="Audit logs"
        columns={columns}
        rows={logs.data?.data ?? []}
        rowKey={(l) => l.id}
        loading={logs.loading}
        error={logs.error ? errorMessage(logs.error) : undefined}
        sort={table.sort}
        onSortChange={table.setSort}
        search={{
          value: table.search,
          onChange: table.setSearch,
          placeholder: "Search by log ID, user, action or resource",
        }}
        toolbar={
          <>
            <Select
              compact
              label="User"
              placeholder="All users"
              options={(users.data ?? []).map((u) => ({ value: u.id, label: u.name }))}
              value={table.filters.userId}
              onChange={(e) => table.setFilter("userId", e.target.value)}
            />
            <Select
              compact
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              value={table.filters.status}
              onChange={(e) => table.setFilter("status", e.target.value as AuditStatus | "")}
            />
            <label className="row">
              <span className="muted">From</span>
              <input
                type="date"
                className="field__input"
                value={table.filters.from}
                max={table.filters.to || undefined}
                onChange={(e) => table.setFilter("from", e.target.value)}
              />
            </label>
            <label className="row">
              <span className="muted">To</span>
              <input
                type="date"
                className="field__input"
                value={table.filters.to}
                min={table.filters.from || undefined}
                onChange={(e) => table.setFilter("to", e.target.value)}
              />
            </label>
          </>
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: logs.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        emptyTitle="No log entries"
        emptyMessage="No entries match these filters."
      />
    </div>
  );
}