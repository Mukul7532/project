import { useEffect, useState } from "react";
import "./StatCard.css";

export default function StatCard({ label, value, trend, tone = "default" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseInt(value.replace(/,/g, ""), 10) : value;

  useEffect(() => {
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 900;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = numericValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericValue, value]);

  return (
    <div className={`stat-card stat-card--${tone}`}>
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">
        {isNaN(numericValue) ? value : displayValue.toLocaleString()}
      </span>
      {trend && <span className="stat-card-trend">{trend}</span>}
    </div>
  );
}