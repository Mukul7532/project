import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ActivityChart.css';

const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      logs: Math.floor(Math.random() * 100) + 50,
      errors: Math.floor(Math.random() * 20) + 5,
      users: Math.floor(Math.random() * 50) + 30
    });
  }
  return data;
};

export default function ActivityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  if (!data.length) return <div className="skeleton" style={{height: '400px'}}></div>;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Activity Trend (30 Days)</h3>
        <span className="chart-period">📅 Last 30 Days</span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <defs>
            <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-primary)" />
          <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />
          <Tooltip contentStyle={{backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: '8px'}} />
          <Legend />
          <Area type="monotone" dataKey="logs" stroke="#3b82f6" fill="url(#colorLogs)" name="Logs" />
          <Area type="monotone" dataKey="errors" stroke="#dc2626" fill="url(#colorErrors)" name="Errors" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}