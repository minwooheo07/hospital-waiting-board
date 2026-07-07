// SVG 기반 도넛 차트. 각 세그먼트를 밝은 → 진한 방향의 선형 그라디언트와
// 둥근 끝(round cap)으로 렌더링해 대시보드 느낌의 현대적인 링을 만든다.
// 값이 모두 0이면 옅은 트랙만 보인다.

function lighten(hex, amt = 0.35) {
  const m = hex.replace("#", "");
  const num = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const mix = (c) => Math.round(c + (255 - c) * amt);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

let uid = 0;

export default function DonutChart({ segments, size = 138, thickness = 15, gap = 4, centerTop, centerBottom }) {
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const idBase = `donut-${++uid}`;

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const active = segments.filter((s) => s.value > 0);

  let offset = 0;
  const arcs =
    total > 0
      ? active.map((s, i) => {
          const fraction = s.value / total;
          const rawLen = fraction * circumference;
          const gapLen = active.length > 1 ? gap : 0;
          const dash = Math.max(rawLen - gapLen, 0.001);
          const arc = {
            id: `${idBase}-${i}`,
            color: s.color,
            dasharray: `${dash} ${circumference - dash}`,
            dashoffset: -offset,
          };
          offset += rawLen;
          return arc;
        })
      : [];

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.06))" }}>
        <defs>
          {arcs.map((a) => (
            <linearGradient key={a.id} id={a.id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={lighten(a.color, 0.28)} />
              <stop offset="100%" stopColor={a.color} />
            </linearGradient>
          ))}
        </defs>
        {/* 배경 트랙 */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#EEF1F6" strokeWidth={thickness} />
        {arcs.map((a) => (
          <circle
            key={a.id}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={`url(#${a.id})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={a.dasharray}
            strokeDashoffset={a.dashoffset}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {centerTop}
        {centerBottom}
      </div>
    </div>
  );
}
