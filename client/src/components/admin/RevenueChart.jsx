// Last-7-days revenue area chart (Recharts).
// Pass `data` = [{ label: "Mon", revenue: 1240, date: "..." }, ...].

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency.js";

const TooltipBox = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="text-text-muted mb-1">{payload[0].payload.label}</p>
      <p className="text-rose-gold font-medium">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="eyebrow text-rose-gold">Revenue</p>
          <h3 className="font-display text-xl mt-1">Last 7 days</h3>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8b4a0" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#e8b4a0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#2a2a35"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#6a6a72"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6a6a72"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              content={<TooltipBox />}
              cursor={{ stroke: "#e8b4a0", strokeOpacity: 0.3 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#e8b4a0"
              strokeWidth={2.5}
              fill="url(#revGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
