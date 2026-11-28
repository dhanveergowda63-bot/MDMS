import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Select from "../../../shared/components/forms/Select";
import DataTable from "../../../shared/components/data/DataTable";
import type {
  Column,
  RowAction,
} from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage, formatDateTime } from "../../../shared/utils/format";
import type {
  Alert,
  AlertSeverity,
  AlertStatus,
} from "../../../shared/types/models";
import { getZoneOptions } from "../services/meterManagementService";
import { getAllAlerts } from "../services/alertManagementService";

const severityOptions = [
  { value: "Critical", label: "Critical" },
  { value: "Warning", label: "Warning" },
  { value: "Info", label: "Info" },
];
const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "Acknowledged", label: "Acknowledged" },
  { value: "Resolved", label: "Resolved" },
];

const columns: Column<Alert>[] = [
  {
    key: "id",
    header: "Alert ID",
    sortable: true,
    render: (a) => <strong>{a.id}</strong>,
  },
  { key: "type", header: "Type", sortable: true },
  { key: "meterId", header: "Meter", sortable: true },
  {
    key: "zoneName",
    header: "Zone",
    sortable: true,
    render: (a) => (
      <Link to={`/enterprise/zones/${a.zoneId}`} className="link">
        {a.zoneName}
      </Link>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    sortable: true,
    render: (a) => <StatusBadge status={a.severity} />,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (a) => <StatusBadge status={a.status} />,
  },
  {
    key: "createdAt",
    header: "Raised",
    sortable: true,
    render: (a) => formatDateTime(a.createdAt),
  },
];

export default function AlertsPage() {
  const navigate = useNavigate();
  const table = useTableState({
    sort: { field: "createdAt", direction: "desc" },
    filters: {
      zoneId: "",
      severity: "" as AlertSeverity | "",
      status: "" as AlertStatus | "",
    },
  });

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    zoneId: table.filters.zoneId,
    severity: table.filters.severity,
    status: table.filters.status,
  };
  const alerts = useApi(
    (s) => getAllAlerts(params, s),
    `ent-alerts:${JSON.stringify(params)}`,
  );
  const zones = useApi(getZoneOptions, "ent-zone-options");

  const rowActions: RowAction<Alert>[] = [
    {
      label: "View zone",
      onClick: (a) => navigate(`/enterprise/zones/${a.zoneId}`),
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Alerts"
        subtitle="Alerts raised by meters in all zones"
      />
      <DataTable
        caption="Alerts from all zones"
        columns={columns}
        rows={alerts.data?.data ?? []}
        rowKey={(a) => a.id}
        loading={alerts.loading}
        error={alerts.error ? errorMessage(alerts.error) : undefined}
        sort={table.sort}
        onSortChange={table.setSort}
        search={{
          value: table.search,
          onChange: table.setSearch,
          placeholder: "Search by alert ID, meter, type or zone",
        }}
        toolbar={
          <>
            <Select
              compact
              label="Zone"
              placeholder="All zones"
              options={(zones.data ?? []).map((z) => ({
                value: z.id,
                label: z.name,
              }))}
              value={table.filters.zoneId}
              onChange={(e) => table.setFilter("zoneId", e.target.value)}
            />
            <Select
              compact
              label="Severity"
              placeholder="All severities"
              options={severityOptions}
              value={table.filters.severity}
              onChange={(e) =>
                table.setFilter(
                  "severity",
                  e.target.value as AlertSeverity | "",
                )
              }
            />
            <Select
              compact
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              value={table.filters.status}
              onChange={(e) =>
                table.setFilter("status", e.target.value as AlertStatus | "")
              }
            />
          </>
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: alerts.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        rowActions={rowActions}
        emptyTitle="No alerts"
        emptyMessage="No alerts match these filters."
      />
    </div>
  );
}
