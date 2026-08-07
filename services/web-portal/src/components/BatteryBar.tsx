export default function BatteryBar({ pct }: { pct: number }) {
  const level = pct < 50 ? 'critical' : pct < 75 ? 'low' : '';
  return (
    <div className="battery-cell">
      <div className={`battery-bar ${level}`}>
        <span style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
      <span>{pct}%</span>
    </div>
  );
}
