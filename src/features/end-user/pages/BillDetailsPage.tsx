import { useParams } from "react-router-dom";
import PageHeader from "../../../shared/components/ui/PageHeader";

// Placeholder: the bill summary and daily table are built in Step 8.
export default function BillDetailsPage() {
  const { billId } = useParams();
  return <PageHeader title="Bill details" subtitle={`Bill ${billId}`} />;
}
