import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import DataTable from "../../../shared/components/data/DataTable";
import type {
  Column,
  RowAction,
} from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import Select from "../../../shared/components/forms/Select";
import ConfirmDialog from "../../../shared/components/feedback/ConfirmDialog";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { eq } from "../../../services/query";
import type { ListQuery } from "../../../services/query";
import { errorMessage } from "../../../shared/utils/format";
import type { Zone } from "../../../shared/types/models";
import { getZones } from "../services/zoneService";
import ZoneFormModal from "../components/ZoneFormModal";

const columns: Column<Zone>[] = [
  { key: "id", header: "Zone ID", sortable: true },
  { key: "name", header: "Zone name", sortable: true },
  { key: "adminName", header: "Assigned admin", sortable: true },
  {
    key: "totalMeters",
    header: "Total meters",
    sortable: true,
    align: "right",
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (zone) => <StatusBadge status={zone.status} />,
  },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Deactivated", label: "Deactivated" },
];

export default function ZoneManagementPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const table = useTableState({
    sort: { field: "name", direction: "asc" },
    filters: { status: "" },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [toggling, setToggling] = useState<Zone | null>(null);

  const query: ListQuery = {
    page: table.page,
    perPage: table.pageSize,
    sort: table.sort,
    where: { status: eq(table.filters.status) },
    search: {
      term: table.debouncedSearch,
      fields: ["name", "adminName", "location"],
    },
  };
  const zones = useApi(
    (signal) => getZones(query, signal),
    JSON.stringify(query),
  );

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const rowActions: RowAction<Zone>[] = [
    {
      label: "View",
      onClick: (zone) => navigate(`/enterprise/zones/${zone.id}`),
    },
    {
      label: "Edit",
      onClick: (zone) => {
        setEditing(zone);
        setFormOpen(true);
      },
    },
    {
      label: (zone) => (zone.status === "Active" ? "Deactivate" : "Activate"),
      danger: (zone) => zone.status === "Active",
      onClick: setToggling,
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Zone management"
        subtitle="All zones, their admins and meters"
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={openAdd}>
            Add zone
          </Button>
        }
      />

      <DataTable
        caption="Zones"
        columns={columns}
        rows={zones.data?.data ?? []}
        rowKey={(zone) => zone.id}
        loading={zones.loading}
        error={zones.error ? errorMessage(zones.error) : undefined}
        emptyTitle="No zones found"
        emptyMessage="Try a different search or status filter."
        sort={table.sort}
        onSortChange={table.setSort}
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: zones.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        search={{
          value: table.search,
          onChange: table.setSearch,
          placeholder: "Search zone, admin or location…",
        }}
        toolbar={
          <Select
            compact
            label="Filter by status"
            value={table.filters.status}
            onChange={(e) => table.setFilter("status", e.target.value)}
            options={statusOptions}
            placeholder="All statuses"
          />
        }
        rowActions={rowActions}
      />

      <ZoneFormModal
        open={formOpen}
        zone={editing}
        onClose={() => setFormOpen(false)}
        onValid={() => {
          setFormOpen(false);
          showToast(
            "Form is valid. Saving zones comes in a later phase.",
            "info",
          );
        }}
      />

      <ConfirmDialog
        open={toggling !== null}
        title={
          toggling?.status === "Active" ? "Deactivate zone?" : "Activate zone?"
        }
        message={
          toggling
            ? `${toggling.name} will be marked ${toggling.status === "Active" ? "deactivated" : "active"}.`
            : ""
        }
        confirmLabel={toggling?.status === "Active" ? "Deactivate" : "Activate"}
        danger={toggling?.status === "Active"}
        onCancel={() => setToggling(null)}
        onConfirm={() => {
          setToggling(null);
          showToast("Status changes are not saved in Phase 1.", "info");
        }}
      />
    </div>
  );
}
