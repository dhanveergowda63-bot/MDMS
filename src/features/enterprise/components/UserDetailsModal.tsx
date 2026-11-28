import { Link } from "react-router-dom";
import Modal from "../../../shared/components/feedback/Modal";
import Button from "../../../shared/components/ui/Button";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { formatDate } from "../../../shared/utils/format";
import type { User } from "../../../shared/types/models";
import { roleLabels } from "../utils/userLabels";

interface UserDetailsModalProps {
  user: User | null; // null = closed
  zoneName: string;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  zoneName,
  onClose,
}: UserDetailsModalProps) {
  return (
    <Modal
      open={user !== null}
      onClose={onClose}
      title={user?.name ?? "User"}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      {user && (
        <dl className="detail-grid">
          <div>
            <dt>User ID</dt>
            <dd>{user.id}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{roleLabels[user.role]}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
          </div>
          <div>
            <dt>Zone</dt>
            <dd>
              {user.zoneId ? (
                <Link
                  to={`/enterprise/zones/${user.zoneId}`}
                  className="link"
                  onClick={onClose}
                >
                  {zoneName}
                </Link>
              ) : (
                zoneName
              )}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={user.status} />
            </dd>
          </div>
          <div>
            <dt>Joined on</dt>
            <dd>{formatDate(user.joinedOn)}</dd>
          </div>
          {user.role === "customer" && (
            <div>
              <dt>Meters</dt>
              <dd>{user.meterCount ?? 0}</dd>
            </div>
          )}
        </dl>
      )}
    </Modal>
  );
}
