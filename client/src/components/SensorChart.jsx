import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import "./SensorChart.css";

function formatTime(ms) {
  return new Date(ms).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit" });
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{formatTime(payload[0].payload.time)}</p>
        <p className="chart-tooltip-value">{payload[0].value}°C</p>
      </div>
    );
  }
  return null;
}

export default function SensorChart({ readings, events }) {
  const data = readings.map((r) => ({ time: new Date(r.timestamp).getTime(), temperature: r.temperature }));

  return (
    <div className="sensor-chart-card">
      <div className="sensor-chart-header">
        <h2>Sensor Trend</h2>
        <span className="sensor-chart-subtitle">Temperature (°C) with event markers</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatTime}
            stroke="#8b8f9c"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#8b8f9c" fontSize={12} tickLine={false} axisLine={false} width={36} unit="°" />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="temperature" stroke="#4f7fff" strokeWidth={2} dot={{ r: 3 }} />
          {events.map((e) => (
            <ReferenceLine
              key={`${e.aggregateId}-${e.version}`}
              x={new Date(e.timestamp).getTime()}
              stroke="rgba(255,255,255,0.15)"
              strokeDasharray="3 3"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}