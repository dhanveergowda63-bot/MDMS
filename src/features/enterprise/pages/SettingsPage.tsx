import { CircleAlert } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import EmptyState from "../../../shared/components/feedback/EmptyState";
import Loader from "../../../shared/components/feedback/Loader";
import { useApi } from "../../../shared/hooks/useApi";
import { errorMessage } from "../../../shared/utils/format";
import { getEnterpriseSettings } from "../services/settingsService";
import SettingsForm from "../components/SettingsForm";

export default function SettingsPage() {
  const settings = useApi(getEnterpriseSettings, "ent-settings");

  let content;
  if (settings.loading) content = <Loader label="Loading settings…" />;
  else if (!settings.data)
    content = (
      <div className="card">
        <EmptyState
          tone="error"
          icon={<CircleAlert size={28} />}
          title="Could not load settings"
          message={errorMessage(settings.error)}
        />
      </div>
    );
  else content = <SettingsForm settings={settings.data} />;

  return (
    <div className="page">
      <PageHeader
        title="Settings & configuration"
        subtitle="Organisation-wide rules for all zones"
      />
      {content}
    </div>
  );
}
