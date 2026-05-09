// Horizontal bar chart — top 5 booked services.
// Pass `data` = [{ _id, name, count }, ...].

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TooltipBox = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="font-medium">{payload[0].payload.name}</p>
      <p className="text-rose-gold">{payload[0].value} bookings</p>
    </div>
  );
};

const TopServicesChart = ({ data = [], dataKey: propDataKey }) => {
  // Auto-detect the data key: prefer prop, fallback to checking if 'bookings' exists, then 'count'
  const dataKey =
    propDataKey ||
    (data.length > 0 && "bookings" in data[0] ? "bookings" : "count");

  return (
    <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
      <p className="eyebrow text-rose-gold mb-1">Most Popular</p>
      <h3 className="font-display text-xl mb-5">Top services</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b87a5e" />
                <stop offset="100%" stopColor="#e8b4a0" />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#2a2a35"
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#6a6a72"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6a6a72"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip
              content={<TooltipBox />}
              cursor={{ fill: "rgba(232,180,160,0.05)" }}
            />
            <Bar
              dataKey={dataKey}
              fill="url(#barGradient)"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopServicesChart;
