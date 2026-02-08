import './GasEffect.css';

export default function GasEffect({ intensity = 1 }) {
  const count = 6;
  return (
    <div className="gas-effect" style={{ opacity: Math.min(1, intensity) }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`smoke s${i + 1}`} />
      ))}
    </div>
  );
}
