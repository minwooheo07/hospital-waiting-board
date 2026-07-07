// 우 → 좌로 흐르는 공지 마퀴. index.css의 @keyframes marquee 를 사용한다.
// 색상은 배치되는 전광판 테마에 맞춰 props로 받는다.
export default function NoticeMarquee({
  notices,
  duration = 55,
  bg = "linear-gradient(90deg, #1E293B 0%, #0F172A 100%)",
  labelColor = "#93C5FD",
  textColor = "#E2E8F0",
  borderColor = "rgba(148,163,184,0.3)",
}) {
  if (!notices || notices.length === 0) return null;
  const text = notices.map((n) => (typeof n === "string" ? n : n.text)).join("      ●      ");

  return (
    <div style={{ background: bg, borderRadius: "16px", padding: "0 22px", height: "46px", display: "flex", alignItems: "center", overflow: "hidden", flexShrink: 0, gap: "14px" }}>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.7rem",
          fontWeight: 800,
          color: labelColor,
          letterSpacing: "0.12em",
          whiteSpace: "nowrap",
          paddingRight: "18px",
          borderRight: `1px solid ${borderColor}`,
        }}
      >
        <span style={{ fontSize: "0.78rem" }}>📢</span> 공지사항
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: `marquee ${duration}s linear infinite`,
            fontSize: "0.82rem",
            color: textColor,
            letterSpacing: "0.01em",
            lineHeight: 1,
          }}
        >
          <span>
            {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
          </span>
        </div>
      </div>
    </div>
  );
}
