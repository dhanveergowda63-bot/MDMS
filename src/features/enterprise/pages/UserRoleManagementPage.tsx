import { useState } from "react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Tabs from "../../../shared/components/ui/Tabs";
import Select from "../../../shared/components/forms/Select";
import ChartCard from "../../../shared/components/charts/ChartCard";
import DonutChart from "../../../shared/components/charts/DonutChart";
import { useApi } from "../../../shared/hooks/useApi";
import { errorMessage, formatNumber } from "../../../shared/utils/format";
import type { UserRole } from "../../../shared/types/models";
import { getZoneOptions } from "../services/meterManagementService";
import { getUserSplit } from "../services/userManagementService";
import UsersTab from "../components/UsersTab";

type TabId = "admins" | "consumers";

const YEARS = [2026, 2025, 2024, 2023, 2022];
const yearOptions = YEARS.map((y) => ({ value: String(y), label: String(y) }));

const tabRoles: Record<TabId, UserRole[]> = {
  admins: ["zone_admin", "enterprise"],
  consumers: ["customer"],
};

export default function UserRoleManagementPage() {
  const [tab, setTab] = useState<TabId>("admins");
  const [year, setYear] = useState(String(YEARS[0]));

  const zones = useApi(getZoneOptions, "ent-zone-options");
  const split = useApi(
    (s) => getUserSplit(Number(year), s),
    `ent-user-split:${year}`,
  );

  const total = (split.data?.active ?? 0) + (split.data?.deactivated ?? 0);

  return (
    <div className="page">
      <PageHeader
        title="User & role management"
        subtitle="Admins and consumers across all zones"
      />

      <ChartCard
        title="Active and deactivated users"
        subtitle={`Users who joined up to the end of ${year}`}
        loading={split.loading}
        error={split.error ? errorMessage(split.error) : undefined}
        empty={total === 0}
        emptyMessage="No users had joined by this year."
        actions={
          <Select
            compact
            label="Year"
            options={yearOptions}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        }
      >
        <DonutChart
          unit="users"
          centerValue={formatNumber(total, 0)}
          centerLabel="users"
          data={[
            {
              name: "Active",
              value: split.data?.active ?? 0,
              color: "var(--success)",
            },
            {
              name: "Deactivated",
              value: split.data?.deactivated ?? 0,
              color: "var(--danger)",
            },
          ]}
        />
      </ChartCard>

      <Tabs
        label="User groups"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "admins", label: "Admins" },
          { id: "consumers", label: "Consumers" },
        ]}
      />
      <UsersTab
        key={tab}
        roles={tabRoles[tab]}
        zones={zones.data ?? []}
        caption={tab === "admins" ? "Admins" : "Consumers"}
      />
    </div>
  );
}
