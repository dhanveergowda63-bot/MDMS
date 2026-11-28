import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bell, Gauge, SearchX, Users, Zap } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import StatCard from "../../../shared/components/ui/StatCard";
import Tabs from "../../../shared/components/ui/Tabs";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import EmptyState from "../../../shared/components/feedback/EmptyState";
import Loader from "../../../shared/components/feedback/Loader";
import { useApi } from "../../../shared/hooks/useApi";
import {
  errorMessage,
  formatNumber,
  isNotFound,
} from "../../../shared/utils/format";
import { getZoneById } from "../services/zoneService";
import {
  countMetersOfZone,
  countOpenAlertsOfZone,
} from "../services/zoneDetailService";
import ZoneMetersTab from "../components/ZoneMetersTab";
import ZoneUsersTab from "../components/ZoneUsersTab";

type TabId = "meters" | "users";

export default function ZoneDetailsPage() {
  const { zoneId = "" } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("meters");

  const zone = useApi((s) => getZoneById(zoneId, s), `zone:${zoneId}`);
  const activeMeters = useApi(
    (s) => countMetersOfZone(zoneId, "Active", s),
    `zone-active-meters:${zoneId}`,
  );
  const openAlerts = useApi(
    (s) => countOpenAlertsOfZone(zoneId, s),
    `zone-open-alerts:${zoneId}`,
  );

  const back = (
    <Button
      icon={<ArrowLeft size={16} />}
      onClick={() => navigate("/enterprise/zones")}
    >
      Back to zones
    </Button>
  );

  if (zone.loading) return <Loader label="Loading zone…" />;

  if (!zone.data) {
    const failed = zone.error !== undefined && !isNotFound(zone.error);
    return (
      <div className="page">
        <PageHeader title={`Zone ${zoneId}`} actions={back} />
        <div className="card">
          <EmptyState
            tone={failed ? "error" : "default"}
            icon={<SearchX size={28} />}
            title={failed ? "Could not load zone" : "Zone not found"}
            message={
              failed ? (
                errorMessage(zone.error)
              ) : (
                <>
                  There is no zone <strong>{zoneId}</strong>.{" "}
                  <Link to="/enterprise/zones" className="link">
                    Back to zone list
                  </Link>
                </>
              )
            }
          />
        </div>
      </div>
    );
  }

  const z = zone.data;
  return (
    <div className="page">
      <PageHeader
        title={
          <span className="row">
            {z.name} <StatusBadge status={z.status} />
          </span>
        }
        subtitle={`${z.id} · ${z.location}`}
        actions={back}
      />

      <div className="grid grid--stats">
        <StatCard
          label="Total meters"
          icon={<Zap size={18} />}
          value={formatNumber(z.totalMeters, 0)}
          hint="All meters in this zone"
        />
        <StatCard
          label="Active meters"
          icon={<Gauge size={18} />}
          tone="success"
          loading={activeMeters.loading}
          value={
            activeMeters.error ? "—" : formatNumber(activeMeters.data ?? 0, 0)
          }
          hint={`of ${z.totalMeters} meters`}
        />
        <StatCard
          label="Customers"
          icon={<Users size={18} />}
          value={formatNumber(z.totalUsers, 0)}
          hint="Accounts in this zone"
        />
        <StatCard
          label="Open alerts"
          icon={<Bell size={18} />}
          tone={(openAlerts.data ?? 0) > 0 ? "danger" : "success"}
          loading={openAlerts.loading}
          value={openAlerts.error ? "—" : formatNumber(openAlerts.data ?? 0, 0)}
          hint="Not yet acknowledged"
        />
      </div>

      <section className="card">
        <h2 className="card__title">Zone information</h2>
        <dl className="detail-grid">
          <div>
            <dt>Zone ID</dt>
            <dd>{z.id}</dd>
          </div>
          <div>
            <dt>Assigned admin</dt>
            <dd>
              {z.adminName} <span className="muted">({z.adminId})</span>
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{z.location}</dd>
          </div>
          <div>
            <dt>Pincode</dt>
            <dd>{z.pincode}</dd>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <dt>Description</dt>
            <dd>{z.description}</dd>
          </div>
        </dl>
      </section>

      <Tabs
        label="Zone details"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "meters", label: `Meters (${z.totalMeters})` },
          { id: "users", label: `Users (${z.totalUsers})` },
        ]}
      />
      {tab === "meters" ? (
        <ZoneMetersTab zoneId={z.id} />
      ) : (
        <ZoneUsersTab zoneId={z.id} />
      )}
    </div>
  );
}
