import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./ActivityChart.css";

const mockTrendData = [
  { day: "Mon", actions: 42 },
  { day: "Tue", actions: 58 },
  { day: "Wed", actions: 35 },
  { day: "Thu", actions: 71 },
  { day: "Fri", actions: 64 },
  { day: "Sat", actions: 29 },
  { day: "Sun", actions: 96 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].value} actions</p>
      </div>
    );
  }
  return null;
}

export default function ActivityChart() {
  return (
    <div className="activity-chart-card">
      <div className="activity-chart-header">
        <h2>Activity Trend</h2>
        <span className="activity-chart-subtitle">Last 7 days</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f7fff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4f7fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#8b8f9c"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#8b8f9c" fontSize={12} tickLine={false} axisLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="actions"
            stroke="#4f7fff"
            strokeWidth={2}
            fill="url(#accentGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}