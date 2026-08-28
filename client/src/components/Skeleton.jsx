import "./Skeleton.css";

export function SkeletonStatsGrid() {
  return (
    <div className="skeleton-stats-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton skeleton-stat-card" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return <div className="skeleton skeleton-chart" />;
}

export function SkeletonTable() {
  return (
    <div className="skeleton-table">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton skeleton-row" />
      ))}
    </div>
  );
}