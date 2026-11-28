import { Link } from "react-router-dom";
import { Bell, Layers, Zap } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import StatCard from "../../../shared/components/ui/StatCard";
import ChartCard from "../../../shared/components/charts/ChartCard";
import ConsumptionChart from "../../../shared/components/charts/ConsumptionChart";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import EmptyState from "../../../shared/components/feedback/EmptyState";
import Skeleton from "../../../shared/components/feedback/Skeleton";
import { useApi } from "../../../shared/hooks/useApi";
import { errorMessage, formatDateTime, formatNumber } from "../../../shared/utils/format";
import {
  countAllMeters,
  countCriticalAlerts,
  countZones,
  getAverageDailyByZone,
  getRecentCriticalAlerts,
} from "../services/dashboardService";

const CHART_DAYS = 30;
const RECENT_ALERTS = 5;

export default function EnterpriseDashboard() {
  const zones = useApi(countZones, "ent-dash-zones");
  const meters = useApi(countAllMeters, "ent-dash-meters");
  const critical = useApi(countCriticalAlerts, "ent-dash-critical");
  const average = useApi((s) => getAverageDailyByZone(CHART_DAYS, s), `ent-dash-average:${CHART_DAYS}`);
  const recent = useApi((s) => getRecentCriticalAlerts(RECENT_ALERTS, s), `ent-dash-recent:${RECENT_ALERTS}`);

  return (
    <div className="page">
      <PageHeader title="Enterprise dashboard" subtitle="Overview of all zones" />

      <div className="grid grid--stats">
        <StatCard
          label="Total zones"
          icon={<Layers size={18} />}
          loading={zones.loading}
          value={zones.error ? "—" : formatNumber(zones.data ?? 0, 0)}
          link={{ to: "/enterprise/zones", label: "Zones" }}
        />
        <StatCard
          label="Total meters"
          icon={<Zap size={18} />}
          loading={meters.loading}
          value={meters.error ? "—" : formatNumber(meters.data ?? 0, 0)}
          hint="Across all zones"
          link={{ to: "/enterprise/meters", label: "Meters" }}
        />
        <StatCard
          label="Critical alerts"
          icon={<Bell size={18} />}
          tone={(critical.data ?? 0) > 0 ? "danger" : "success"}
          loading={critical.loading}
          value={critical.error ? "—" : formatNumber(critical.data ?? 0, 0)}
          hint="Open or acknowledged"
          link={{ to: "/enterprise/alerts", label: "Alerts" }}
        />
      </div>

      <div className="grid grid--2">
        <ChartCard
          title="Average consumption per zone"
          subtitle={`kWh per day, last ${CHART_DAYS} days`}
          loading={average.loading}
          error={average.error ? errorMessage(average.error) : undefined}
          empty={(average.data ?? []).length === 0}
        >
          <ConsumptionChart
            data={average.data ?? []}
            xKey="zone"
            series={[{ key: "kwh", name: "Average per day" }]}
            type="bar"
          />
        </ChartCard>

        <section className="card">
          <h2 className="card__title">Recent critical alerts</h2>
          {recent.loading ? (
            <Skeleton height={200} radius={8} />
          ) : recent.error ? (
            <EmptyState tone="error" title="Could not load alerts" message={errorMessage(recent.error)} />
          ) : (recent.data ?? []).length === 0 ? (
            <EmptyState title="No critical alerts" message="Nothing needs attention right now." />
          ) : (
            <>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {(recent.data ?? []).map((a) => (
                  <li key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <div className="row">
                      <StatusBadge status={a.severity} />
                      <strong>{a.type}</strong>
                    </div>
                    <div className="muted">
                      {a.meterId} · {a.zoneName} · {formatDateTime(a.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 12 }}>
                <Link to="/enterprise/alerts" className="link">
                  View all alerts
                </Link>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}