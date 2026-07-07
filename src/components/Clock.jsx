import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {pad(time.getHours())}
        <span style={{ opacity: 0.3 }}>:</span>
        {pad(time.getMinutes())}
        <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>
          <span style={{ opacity: 0.3 }}>:</span>
          {pad(time.getSeconds())}
        </span>
      </div>
      <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "4px" }}>
        {time.getFullYear()}. {pad(time.getMonth() + 1)}. {pad(time.getDate())} ({days[time.getDay()]})
      </div>
    </div>
  );
}
