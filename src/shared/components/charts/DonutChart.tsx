import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { tooltipProps } from "./chartTheme";
import { formatNumber } from "../../utils/format";

export interface DonutSlice {
  name: string;
  value: number;
  color: string; // any CSS colour, e.g. "var(--success)"
}

interface DonutChartProps {
  data: DonutSlice[];
  centerValue?: string; // big text in the hole, e.g. the total
  centerLabel?: string; // small text under it
  unit?: string; // shown in the tooltip, e.g. "users"
}

// Donut chart that fills its parent's height and follows the light/dark theme.
export default function DonutChart({
  data,
  centerValue,
  centerLabel,
  unit = "",
}: DonutChartProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={data.length > 1 ? 2 : 0}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipProps}
            formatter={(value, name) => [
              `${formatNumber(Number(value), 0)} ${unit}`.trim(),
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -62%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>
            {centerValue}
          </div>
          {centerLabel && (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
