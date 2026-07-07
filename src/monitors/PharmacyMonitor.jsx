import { useEffect, useRef, useState } from "react";
import Clock from "../components/Clock";
import BoardNav from "../components/BoardNav";
import { fetchPharmacyQueue, fetchHospitalInfo, fetchNotices, nextPharmacyNumber } from "../api/dataService";

const ACCENT = "#0D9488";
const CALL_INTERVAL_MS = 8000;
// 패널 높이 안에서 스크롤 없이 다 보여줄 수 있는 만큼만 유지한다 (넘치면 오래된 항목부터 제거).
const MAX_QUEUE = 10;

function formatElapsed(calledAt, now) {
  const sec = Math.max(0, Math.floor((now - calledAt) / 1000));
  if (sec < 60) return `${sec}초 전`;
  return `${Math.floor(sec / 60)}분 전`;
}

// 좌측 상단: 현재 호출된 투약번호를 크게 표시
function CurrentCallCard({ current, now }) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: "24px",
        background: `linear-gradient(160deg, ${ACCENT}EE 0%, ${ACCENT}AA 100%)`,
        boxShadow: `0 8px 32px ${ACCENT}45`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "32px 24px",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(180deg,rgba(255,255,255,0.16) 0%,transparent 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", zIndex: 1, marginBottom: "18px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fff", animation: "pulse 1.2s ease-in-out infinite" }} />
        <span style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: "0.2em" }}>지금 호출 중인 번호</span>
      </div>

      <div
        key={current.number}
        style={{
          fontSize: "5rem",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1,
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 6px 24px rgba(0,0,0,0.25)",
          zIndex: 1,
          animation: "callIn 0.4s ease-out",
          whiteSpace: "nowrap",
        }}
      >
        {current.number}
      </div>

      <div style={{ marginTop: "22px", zIndex: 1, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "999px", padding: "8px 22px" }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>💊 약국 창구에서 수령해 주세요</span>
      </div>

      <div style={{ marginTop: "14px", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", zIndex: 1 }}>{formatElapsed(current.calledAt, now)} 호출됨</div>
    </div>
  );
}

// 좌측 하단: 병원 정보
function HospitalInfoCard({ info }) {
  return (
    <div style={{ background: "#fff", borderRadius: "20px", padding: "22px 24px", boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🏥</div>
        <div>
          <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#111827" }}>{info.name}</div>
          <div style={{ fontSize: "0.65rem", color: "#9CA3AF", letterSpacing: "0.08em" }}>{info.nameEn}</div>
        </div>
      </div>

      <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.12em", marginBottom: "10px" }}>진료 시간</div>
      {info.hours.map((h, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < info.hours.length - 1 ? "1px solid #F9FAFB" : "none" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280" }}>{h.day}</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: h.closed ? "#9CA3AF" : ACCENT }}>{h.time}</span>
        </div>
      ))}

      <div style={{ marginTop: "14px", padding: "10px 14px", background: `${ACCENT}0D`, borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "0.9rem" }}>📞</span>
        <span style={{ fontSize: "0.8rem", color: ACCENT, fontWeight: 800 }}>원내약국 대표번호 {info.phone}</span>
      </div>
    </div>
  );
}

// 우측 하단: 공지사항 (우 → 좌로 흐르는 마퀴)
function NoticeMarquee({ notices }) {
  const text = notices.map((n) => n.text).join("     ★     ");
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #134E4A 0%, #0F3D38 100%)",
        borderRadius: "16px",
        padding: "0 22px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        flexShrink: 0,
        gap: "14px",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.68rem",
          fontWeight: 800,
          color: "#5EEAD4",
          letterSpacing: "0.12em",
          whiteSpace: "nowrap",
          paddingRight: "18px",
          borderRight: "1px solid rgba(94,234,212,0.25)",
        }}
      >
        <span style={{ fontSize: "0.75rem" }}>📢</span> 공지사항
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "marquee 60s linear infinite",
            fontSize: "0.8rem",
            color: "#CCFBF1",
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

// 우측: 조제완료된 투약번호 목록. 패널 높이가 고정돼 있고 자리가 넉넉하므로
// 페이징 없이 반응형 그리드로 전체를 한 번에 보여준다.
function ReadyList({ queue, now }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", minHeight: 0, minWidth: 0 }}>
      <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>조제완료 · 수령 대기</div>
          <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "3px" }}>
            총 <strong style={{ color: ACCENT }}>{queue.length}</strong>건 대기 중
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", animation: "pulse 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>실시간</span>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, overflow: "hidden", padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gridAutoRows: "min-content", alignContent: "start", gap: "12px" }}>
        {queue.map((item, i) => {
          const isLatest = i === 0;
          return (
            <div
              key={item.number}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 18px",
                borderRadius: "16px",
                background: isLatest ? `${ACCENT}0F` : "#FAFAFA",
                border: isLatest ? `2px solid ${ACCENT}` : "1.5px solid #F0F2F5",
                boxShadow: isLatest ? `0 0 0 4px ${ACCENT}12` : "none",
                animation: isLatest ? "fadeUp 0.4s ease-out" : "none",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: isLatest ? ACCENT : "#E5E7EB",
                  color: isLatest ? "#fff" : "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}
              >
                💊
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: isLatest ? ACCENT : "#374151", fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}>{item.number}</div>
                <div style={{ fontSize: "0.68rem", color: "#9CA3AF", marginTop: "2px" }}>{formatElapsed(item.calledAt, now)}</div>
              </div>
              {isLatest && <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#fff", background: ACCENT, padding: "3px 9px", borderRadius: "999px", flexShrink: 0 }}>NEW</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PharmacyMonitor() {
  const [queue, setQueue] = useState(null);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [notices, setNotices] = useState([]);
  const [now, setNow] = useState(Date.now());
  const queueRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchPharmacyQueue(), fetchHospitalInfo(), fetchNotices()]).then(([q, info, ntc]) => {
      setQueue(q);
      queueRef.current = q;
      setHospitalInfo(info);
      setNotices(ntc);
    });
  }, []);

  // 화면에 표시되는 "몇 초 전" 문구 갱신
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // 새 투약번호 호출 시뮬레이션 (실서비스에서는 조제 시스템의 실시간 이벤트로 교체)
  useEffect(() => {
    const id = setInterval(() => {
      setQueue((prev) => {
        const last = prev[0]?.number ?? "284193";
        const next = { number: nextPharmacyNumber(last), calledAt: Date.now() };
        const updated = [next, ...prev].slice(0, MAX_QUEUE);
        queueRef.current = updated;
        return updated;
      });
    }, CALL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (!queue || !hospitalInfo) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "0.9rem" }}>
        호출 현황을 불러오는 중…
      </div>
    );
  }

  const current = queue[0];

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#F1F5F9", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes callIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* 헤더 */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: `linear-gradient(135deg, ${ACCENT} 0%, #0F766E 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", boxShadow: `0 2px 8px ${ACCENT}40` }}>
            💊
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{hospitalInfo.name}</div>
            <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "3px", letterSpacing: "0.05em" }}>
              <span style={{ color: ACCENT, fontWeight: 700 }}>원내약국</span> · 투약번호 호출 현황판
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <BoardNav />
          <Clock />
        </div>
      </div>

      {/* 본문: 세로 2단 (좌: 호출번호/병원정보, 우: 조제완료 목록) */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "420px 1fr", gap: "18px", padding: "18px", minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", minHeight: 0 }}>
          <CurrentCallCard current={current} now={now} />
          <HospitalInfoCard info={hospitalInfo} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", minHeight: 0, minWidth: 0 }}>
          <ReadyList queue={queue} now={now} />
          {notices.length > 0 && <NoticeMarquee notices={notices} />}
        </div>
      </div>
    </div>
  );
}
