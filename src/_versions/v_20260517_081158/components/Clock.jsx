import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="topbar-datetime mono" style={{ fontWeight: 'bold' }}>
      {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
      {' · '}
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}
