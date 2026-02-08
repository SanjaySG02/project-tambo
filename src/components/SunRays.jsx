import './SunRays.css';

export default function SunRays({ intensity = 1 }) {
  const count = 16;
  return (
    <div className="sun-rays" style={{ opacity: Math.min(1, intensity) }}>
      <div className="sun" />
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`ray r${i + 1}`} />
      ))}
    </div>
  );
}
