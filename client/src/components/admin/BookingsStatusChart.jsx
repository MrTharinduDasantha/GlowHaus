// Donut chart — booking status breakdown.
// Pass `data` = [{ _id: "confirmed", count: 12 }, ...].

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  pending: "#fbbf24",
  confirmed: "#93c5fd",
  completed: "#6ee7a7",
  cancelled: "#f87171",
};

const TooltipBox = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs capitalize">
      <p className="font-medium">{p._id}</p>
      <p className="text-text-muted">{p.count} bookings</p>
    </div>
  );
};

const BookingsStatusChart = ({ data = [] }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="p-5 bg-bg-surface border border-line-soft rounded-2xl">
      <p className="eyebrow text-rose-gold mb-1">Bookings</p>
      <h3 className="font-display text-xl mb-5">Status breakdown</h3>

      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[entry._id] || "#a8a8b3"} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-text-muted">Total</p>
          <p className="font-display text-3xl text-text-primary">{total}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((d) => (
          <div key={d._id} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: COLORS[d._id] || "#a8a8b3" }}
            />
            <span className="capitalize text-text-secondary">{d._id}</span>
            <span className="text-text-muted">({d.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsStatusChart;
