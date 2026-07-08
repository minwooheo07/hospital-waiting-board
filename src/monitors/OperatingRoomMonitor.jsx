import { useEffect, useMemo, useState } from "react";
import Clock from "../components/Clock";
import BoardNav from "../components/BoardNav";
import NoticeMarquee from "../components/NoticeMarquee";
import { usePaging } from "../hooks/usePaging";
import { fetchORStatus } from "../api/dataService";
import { OR_STATUS_LEVELS } from "../data/mockData";
import { maskName } from "../utils/maskName";

const ACCENT = "#7C3AED";
const ROWS_PER_PAGE = 7;

// 진행현황 우선순위(수술 중인 환자가 가장 먼저 보이도록)
const STATUS_ORDER = ["수술중", "마취중", "회복중", "대기", "완료"];

// 표 컬럼 너비를 고정해 특정 항목만 커지지 않고 일관되게 맞춘다.
const GRID_COLS = "56px 108px 1fr 120px 130px 100px 150px 120px";

function formatElapsed(min) {
  if (min < 60) return `${min}분`;
  return `${Math.floor(min / 60)}시간 ${min % 60}분`;
}

function StatusBadge({ value }) {
  const cfg = OR_STATUS_LEVELS[value] || OR_STATUS_LEVELS["대기"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "0.95rem",
        fontWeight: 800,
        padding: "7px 16px",
        borderRadius: "999px",
        color: cfg.color,
        background: cfg.bg,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: cfg.color, flexShrink: 0, animation: value === "수술중" ? "pulse 1.4s ease-in-out infinite" : "none" }} />
      {value}
    </span>
  );
}

// 상단 요약 스탯 칩 — 도넛 대신 한 줄로 압축된 현대적인 요약 바
function StatChip({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "10px 18px", borderRadius: "14px", background: "#fff", border: "1px solid #EEF1F6", boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}>
      <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0F172A" }}>{value}</span>
    </div>
  );
}

export default function OperatingRoomMonitor() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchORStatus().then((res) => setData(res));
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const { patients, roomCapacity } = data;
    const occupiedRooms = new Set(patients.filter((p) => p.status !== "완료").map((p) => p.room)).size;
    const statusCounts = STATUS_ORDER.map((status) => ({
      label: status,
      value: patients.filter((p) => p.status === status).length,
      color: OR_STATUS_LEVELS[status].color,
    }));
    return { occupiedRooms, roomCapacity, statusCounts };
  }, [data]);

  const patients = useMemo(() => {
    if (!data) return [];
    return [...data.patients].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.startedMin - a.startedMin);
  }, [data]);

  const { pageItems, page, totalPages } = usePaging(patients, ROWS_PER_PAGE);

  if (!data || !stats) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: "0.9rem" }}>
        수술실 현황을 불러오는 중…
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#F1F5F9", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: `linear-gradient(135deg, ${ACCENT} 0%, #4C1D95 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", boxShadow: `0 4px 12px ${ACCENT}40` }}>
            🔪
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.1 }}>롯데병원</div>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "3px", letterSpacing: "0.05em" }}>
              <span style={{ color: ACCENT, fontWeight: 700 }}>수술실</span> · 수술 진행 현황판
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <BoardNav />
          <Clock />
        </div>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", padding: "16px", minHeight: 0 }}>
        {/* 상단 요약 스탯 바 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flexShrink: 0 }}>
          <StatChip label="가동 수술방" value={`${stats.occupiedRooms}/${stats.roomCapacity}`} color={ACCENT} />
          {stats.statusCounts.map((s) => (
            <StatChip key={s.label} label={s.label} value={s.value} color={s.color} />
          ))}
        </div>

        {/* 수술 환자 리스트 — 스크롤 대신 자동 페이징 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #EEF1F6", boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05)", minHeight: 0 }}>
          <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0F172A" }}>
              수술 진행 현황
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94A3B8", marginLeft: "10px" }}>총 {patients.length}건</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <div key={i} style={{ width: i === page ? "18px" : "6px", height: "6px", borderRadius: "3px", background: i === page ? ACCENT : "#E2E8F0", transition: "all 0.3s" }} />
                  ))}
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8", marginLeft: "4px" }}>
                    {page + 1}/{totalPages}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", animation: "pulse 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>실시간</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: GRID_COLS, padding: "10px 24px", gap: "10px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
            {["순번", "수술방", "환자명", "성별/나이", "진료과", "병동", "진행현황", "경과시간"].map((h) => (
              <div key={h} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em" }}>
                {h}
              </div>
            ))}
          </div>

          <div key={page} style={{ flex: 1, overflow: "hidden", animation: "pageIn 0.35s ease-out" }}>
            {pageItems.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: GRID_COLS,
                  alignItems: "center",
                  padding: "16px 24px",
                  gap: "10px",
                  borderBottom: "1px solid #F8FAFC",
                  borderLeft: p.status === "수술중" ? `3px solid ${OR_STATUS_LEVELS["수술중"].color}` : "3px solid transparent",
                  background: p.status === "수술중" ? "#FAF5FF" : "#fff",
                }}
              >
                <div style={{ fontSize: "0.95rem", color: "#94A3B8", fontWeight: 700 }}>{page * ROWS_PER_PAGE + i + 1}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#334155" }}>{p.room}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{maskName(p.name)}</div>
                <div style={{ fontSize: "1.05rem", color: "#64748B", fontWeight: 600 }}>
                  {p.gender} · {p.age}세
                </div>
                <div style={{ fontSize: "1.05rem", color: "#334155", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.dept}</div>
                <div style={{ fontSize: "1.05rem", color: "#64748B", fontWeight: 600 }}>{p.ward}</div>
                <div>
                  <StatusBadge value={p.status} />
                </div>
                <div style={{ fontSize: "1.05rem", color: "#64748B", fontWeight: 600 }}>{p.status === "대기" ? "-" : formatElapsed(p.startedMin)}</div>
              </div>
            ))}
          </div>
        </div>

        <NoticeMarquee notices={data.notices} bg="linear-gradient(90deg,#4C1D95,#2E1065)" labelColor="#C4B5FD" textColor="#EDE9FE" borderColor="rgba(196,181,253,0.3)" />
      </div>
    </div>
  );
}
