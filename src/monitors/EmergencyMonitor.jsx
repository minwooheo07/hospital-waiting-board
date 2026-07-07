import { useEffect, useMemo, useState } from "react";
import Clock from "../components/Clock";
import BoardNav from "../components/BoardNav";
import DonutChart from "../components/DonutChart";
import NoticeMarquee from "../components/NoticeMarquee";
import { fetchERStatus } from "../api/dataService";
import { usePaging } from "../hooks/usePaging";
import { KTAS_LEVELS, KTAS_WAIT } from "../data/mockData";

const ACCENT = "#E11D48";
const ROWS_PER_PAGE = 6;

// 검사 상태별 색상 (모던 팔레트)
const TEST_STATUS = {
  대기: { bg: "#FEF3C7", color: "#B45309", dot: "#F59E0B" },
  진행중: { bg: "#EEF2FF", color: "#4F46E5", dot: "#6366F1" },
  완료: { bg: "#ECFDF5", color: "#047857", dot: "#10B981" },
  해당없음: { bg: "#F1F5F9", color: "#94A3B8", dot: "#CBD5E1" },
};

const STATUS_CONFIG = {
  대기: { bg: "#FEF3C7", color: "#B45309" },
  진료중: { bg: "#ECFDF5", color: "#047857" },
  입원대기: { bg: "#F5F3FF", color: "#7C3AED" },
  퇴실대기: { bg: "#F1F5F9", color: "#64748B" },
};

const RESOURCE_STATUS = {
  가능: { color: "#059669", bg: "#ECFDF5" },
  제한: { color: "#D97706", bg: "#FFFBEB" },
  불가: { color: "#DC2626", bg: "#FEF2F2" },
};

const cardStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "18px 20px",
  border: "1px solid #EEF1F6",
  boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05)",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const cardTitle = (title, subtitle) => (
  <div style={{ marginBottom: "14px" }}>
    <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>{title}</div>
    {subtitle && <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: "2px" }}>{subtitle}</div>}
  </div>
);

function TestBadge({ value }) {
  const cfg = TEST_STATUS[value] || TEST_STATUS["해당없음"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", fontWeight: 700, padding: "3px 9px 3px 7px", borderRadius: "999px", color: cfg.color, background: cfg.bg, whiteSpace: "nowrap" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.dot }} />
      {value}
    </span>
  );
}

function StatusBadge({ value }) {
  const cfg = STATUS_CONFIG[value] || STATUS_CONFIG["대기"];
  return (
    <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "4px 11px", borderRadius: "999px", color: cfg.color, background: cfg.bg, whiteSpace: "nowrap" }}>
      {value}
    </span>
  );
}

function KtasBadge({ level }) {
  const cfg = KTAS_LEVELS[level];
  const textColor = level === 3 ? "#7A5B00" : "#fff";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", fontWeight: 800, color: textColor, background: cfg.color, padding: "4px 10px", borderRadius: "8px", whiteSpace: "nowrap", boxShadow: `0 2px 6px ${cfg.color}40` }}>
      {level} · {cfg.label}
    </span>
  );
}

function WaitBadge({ level }) {
  const cfg = KTAS_WAIT[level];
  if (cfg.immediate) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.74rem", fontWeight: 800, color: "#E11D48", background: "#FEF2F2", padding: "4px 10px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E11D48", animation: "pulse 1.4s ease-in-out infinite" }} />
        {cfg.text}
      </span>
    );
  }
  return <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>{cfg.text}</span>;
}

function BedBadge({ bed }) {
  const isResus = bed.startsWith("R");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: "0.75rem", fontWeight: 800, color: isResus ? "#E11D48" : "#334155", background: isResus ? "#FEF2F2" : "#F1F5F9", border: `1px solid ${isResus ? "#FBCFE8" : "#E2E8F0"}`, padding: "3px 8px", borderRadius: "7px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      {bed}
    </span>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", flex: 1, minWidth: 0 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "9px", height: "9px", borderRadius: "3px", background: item.color, flexShrink: 0 }} />
          <span style={{ fontSize: "0.75rem", color: "#64748B", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F172A" }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function centerNum(top, bottom) {
  return {
    top: (
      <div key="t" style={{ fontSize: "1.65rem", fontWeight: 900, color: "#0F172A", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
        {top}
      </div>
    ),
    bottom: (
      <div key="b" style={{ fontSize: "0.62rem", color: "#94A3B8", marginTop: "3px", fontWeight: 700 }}>
        {bottom}
      </div>
    ),
  };
}

// 구역별 병상 가용 현황 (프로그레스 바)
function ZoneBars({ zones }) {
  return (
    <div style={{ ...cardStyle, gap: "0" }}>
      {cardTitle("구역별 병상 가용", "사용 / 전체")}
      <div style={{ display: "flex", flexDirection: "column", gap: "13px", flex: 1, justifyContent: "center" }}>
        {zones.map((z) => {
          const rate = z.used / z.total;
          const full = z.used >= z.total;
          return (
            <div key={z.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>{z.name}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: full ? "#E11D48" : "#0F172A" }}>
                  {z.used}
                  <span style={{ color: "#CBD5E1", fontWeight: 600 }}> / {z.total}</span>
                  {full && <span style={{ fontSize: "0.62rem", color: "#E11D48", marginLeft: "5px", fontWeight: 800 }}>만실</span>}
                </span>
              </div>
              <div style={{ height: "7px", borderRadius: "999px", background: "#EEF1F6", overflow: "hidden" }}>
                <div style={{ width: `${rate * 100}%`, height: "100%", borderRadius: "999px", background: full ? "linear-gradient(90deg,#FB7185,#E11D48)" : `linear-gradient(90deg, ${z.color}AA, ${z.color})` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 보딩 & 중환자 자원
function ResourceCard({ resources }) {
  const icu = RESOURCE_STATUS[resources.icu] || RESOURCE_STATUS["제한"];
  const or = RESOURCE_STATUS[resources.or] || RESOURCE_STATUS["가능"];
  return (
    <div style={{ ...cardStyle }}>
      {cardTitle("입원 대기 · 중환자 자원", "병상 부족 현황")}
      <div style={{ borderRadius: "16px", padding: "14px 16px", background: "linear-gradient(135deg,#FFF1F2,#FFE4E6)", border: "1px solid #FECDD3", display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>🛏️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.68rem", color: "#9F1239", fontWeight: 700 }}>입원 대기(보딩) 환자</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "#E11D48", lineHeight: 1 }}>{resources.boarding}</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9F1239" }}>명</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "중환자실(ICU)", value: resources.icu, cfg: icu },
          { label: "수술실(OR)", value: resources.or, cfg: or },
        ].map((r) => (
          <div key={r.label} style={{ borderRadius: "12px", padding: "10px 12px", background: r.cfg.bg, textAlign: "center" }}>
            <div style={{ fontSize: "0.66rem", color: "#64748B", fontWeight: 700, marginBottom: "3px" }}>{r.label}</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 900, color: r.cfg.color }}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 검사 평균 소요시간
function TestTimesCard({ testTimes }) {
  return (
    <div style={{ ...cardStyle }}>
      {cardTitle("검사 평균 소요시간", "최근 1~2시간 기준")}
      <div style={{ display: "flex", flexDirection: "column", gap: "11px", flex: 1, justifyContent: "center" }}>
        {testTimes.map((t) => (
          <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{t.icon}</div>
            <span style={{ flex: 1, fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>{t.name}</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>
              {t.min}
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", marginLeft: "2px" }}>분</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EmergencyMonitor() {
  const [data, setData] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchERStatus().then((res) => {
      const startedAt = Date.now();
      setData({
        ...res,
        startedAt,
        patients: res.patients.map((p) => ({ ...p, arrivalAt: startedAt - p.arrivalMin * 60000 })),
      });
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const { patients, bedCapacity } = data;
    const occupied = patients.length;

    const ktasCounts = [1, 2, 3, 4, 5].map((lvl) => ({
      label: `${lvl} · ${KTAS_LEVELS[lvl].label}`,
      value: patients.filter((p) => p.ktas === lvl).length,
      color: KTAS_LEVELS[lvl].color,
    }));

    return { occupied, bedCapacity, ktasCounts };
  }, [data]);

  // 중증도(KTAS) → 내원시각 순 정렬. 훅 규칙을 지키기 위해 조기 반환 이전에 계산한다.
  const patients = useMemo(
    () => (data ? [...data.patients].sort((a, b) => a.ktas - b.ktas || a.arrivalAt - b.arrivalAt) : []),
    [data]
  );
  const { pageItems, page, totalPages } = usePaging(patients, ROWS_PER_PAGE);

  if (!data || !stats) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: "0.9rem" }}>
        응급실 현황을 불러오는 중…
      </div>
    );
  }

  const occupancyRate = Math.round((stats.occupied / stats.bedCapacity) * 100);
  const occCenter = centerNum(`${occupancyRate}%`, `${stats.occupied}/${stats.bedCapacity} 병상`);
  const ktasCenter = centerNum(stats.occupied, "명 재실");
  const gridCols = "34px 62px 96px minmax(52px,0.6fr) 66px 90px 104px minmax(80px,1.2fr) 58px 76px 76px 80px";

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#F1F5F9", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: `linear-gradient(135deg, ${ACCENT} 0%, #9F1239 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", boxShadow: `0 4px 12px ${ACCENT}40` }}>
            🚑
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.1 }}>롯데병원</div>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "3px", letterSpacing: "0.05em" }}>
              <span style={{ color: ACCENT, fontWeight: 700 }}>응급실</span> · 혼잡도 현황판
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
        {/* 상단 통계 카드 5개 */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(230px,1fr) minmax(230px,1fr) minmax(210px,0.9fr) minmax(220px,0.9fr) minmax(220px,0.9fr)", gap: "14px", flexShrink: 0 }}>
          <div style={{ ...cardStyle }}>
            {cardTitle("병상 가동률", `총 ${stats.bedCapacity}병상`)}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <DonutChart segments={[{ value: stats.occupied, color: ACCENT }, { value: Math.max(stats.bedCapacity - stats.occupied, 0), color: "#E2E8F0" }]} centerTop={occCenter.top} centerBottom={occCenter.bottom} />
              <Legend items={[{ label: "입실 중", value: stats.occupied, color: ACCENT }, { label: "가용", value: Math.max(stats.bedCapacity - stats.occupied, 0), color: "#CBD5E1" }]} />
            </div>
          </div>

          <div style={{ ...cardStyle }}>
            {cardTitle("중증도 분포", "KTAS 등급 기준")}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <DonutChart segments={stats.ktasCounts} centerTop={ktasCenter.top} centerBottom={ktasCenter.bottom} />
              <Legend items={stats.ktasCounts} />
            </div>
          </div>

          <ZoneBars zones={data.zones} />
          <ResourceCard resources={data.resources} />
          <TestTimesCard testTimes={data.testTimes} />
        </div>

        {/* 환자 리스트 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #EEF1F6", boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05)", minHeight: 0 }}>
          <div style={{ padding: "15px 22px 11px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#0F172A" }}>
              현재 응급실 환자 현황
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", marginLeft: "8px" }}>총 {patients.length}명</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <div key={i} style={{ width: i === page ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === page ? ACCENT : "#E2E8F0", transition: "all 0.3s" }} />
                  ))}
                  <span style={{ fontSize: "0.68rem", color: "#94A3B8", marginLeft: "3px" }}>
                    {page + 1}/{totalPages}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", animation: "pulse 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>실시간</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: gridCols, padding: "8px 22px", gap: "8px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
            {["순번", "Bed", "등록번호", "이름", "나이/성별", "중증도", "예상대기", "주증상", "경과시간", "영상검사", "랩검사", "상태"].map((h) => (
              <div key={h} style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em" }}>
                {h}
              </div>
            ))}
          </div>

          <div key={page} style={{ flex: 1, overflow: "hidden", animation: "pageIn 0.35s ease-out" }}>
            {pageItems.map((p, i) => {
              const elapsedMin = Math.floor((now - p.arrivalAt) / 60000);
              return (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    alignItems: "center",
                    padding: "11px 22px",
                    gap: "8px",
                    borderBottom: "1px solid #F8FAFC",
                    background: p.ktas === 1 ? "#FFF5F6" : "#fff",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 700 }}>{page * ROWS_PER_PAGE + i + 1}</div>
                  <div>
                    <BedBadge bed={p.bed} />
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{p.number}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                    {p.age}세 · {p.gender}
                  </div>
                  <div>
                    <KtasBadge level={p.ktas} />
                  </div>
                  <div>
                    <WaitBadge level={p.ktas} />
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.complaint}</div>
                  <div style={{ fontSize: "0.8rem", color: elapsedMin >= 60 ? "#E11D48" : "#64748B", fontWeight: elapsedMin >= 60 ? 800 : 600 }}>{elapsedMin}분</div>
                  <div>
                    <TestBadge value={p.imaging} />
                  </div>
                  <div>
                    <TestBadge value={p.lab} />
                  </div>
                  <div>
                    <StatusBadge value={p.status} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 필수 안내 문구 */}
          <div style={{ flexShrink: 0, padding: "12px 22px", borderTop: "1px solid #F1F5F9", background: "#FFF7ED", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#9A3412", lineHeight: 1.5, wordBreak: "keep-all" }}>
              응급도에 따라 나중에 온 환자가 먼저 진료받을 수 있습니다.
            </span>
          </div>
        </div>

        {/* 하단 공지 마퀴 (우 → 좌) */}
        <NoticeMarquee notices={data.notices} bg="linear-gradient(90deg,#881337,#4C0519)" labelColor="#FDA4AF" textColor="#FFE4E6" borderColor="rgba(253,164,175,0.3)" />
      </div>
    </div>
  );
}
