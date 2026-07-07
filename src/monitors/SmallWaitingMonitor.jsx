import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import BoardNav from "../components/BoardNav";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchDepartments, fetchNotices, fetchHospitalInfo } from "../api/dataService";

const COLOR_PRESETS = [
  { label: "오션 블루", color: "#2563EB" },
  { label: "에메랄드", color: "#059669" },
  { label: "로즈 레드", color: "#DC2626" },
  { label: "바이올렛", color: "#7C3AED" },
  { label: "선셋 오렌지", color: "#EA580C" },
  { label: "핫 핑크", color: "#DB2777" },
  { label: "틸 그린", color: "#0D9488" },
  { label: "인디고", color: "#4F46E5" },
  { label: "앰버", color: "#D97706" },
  { label: "슬레이트", color: "#475569" },
  { label: "시안", color: "#0891B2" },
  { label: "라임", color: "#65A30D" },
];

// ─── 공지사항 패널 (1명 가로 레이아웃 전용) ──────────────────
function NoticePanel({ accent, notices, hospitalInfo }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % notices.length);
        setFade(true);
      }, 350);
    }, 4000);
    return () => clearInterval(id);
  }, [notices.length]);

  const item = notices[idx];
  const tagColors = { 공지: "#2563EB", 안내: "#059669", 건강정보: "#7C3AED" };
  const tagColor = tagColors[item.tag] || accent;

  return (
    <div style={{ background: "#fff", borderRadius: "20px", padding: "18px 20px", boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "0" }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.15em" }}>공지사항</div>
        <div style={{ display: "flex", gap: "4px" }}>
          {notices.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setIdx(i);
                setFade(true);
              }}
              style={{ width: i === idx ? "16px" : "5px", height: "5px", borderRadius: "3px", background: i === idx ? accent : "#E5E7EB", transition: "all 0.35s", cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      {/* 아이콘 */}
      <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.35s", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "center", fontSize: "2.4rem", lineHeight: 1 }}>{item.icon}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 800, color: tagColor, background: `${tagColor}15`, padding: "2px 10px", borderRadius: "20px", letterSpacing: "0.08em" }}>{item.tag}</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.7, textAlign: "center", wordBreak: "keep-all" }}>{item.text}</div>
      </div>

      {/* 구분선 */}
      <div style={{ height: "1px", background: "#F3F4F6", margin: "14px 0" }} />

      {/* 진료시간 */}
      <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.12em", marginBottom: "10px" }}>진료 시간</div>
      {hospitalInfo.hours.map((h, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < hospitalInfo.hours.length - 1 ? "1px solid #F9FAFB" : "none" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6B7280" }}>{h.day}</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: h.closed ? "#9CA3AF" : accent }}>{h.time}</span>
        </div>
      ))}

      {/* 대표전화 */}
      <div style={{ marginTop: "12px", padding: "8px 12px", background: `${accent}0D`, borderRadius: "10px", display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{ fontSize: "0.8rem" }}>📞</span>
        <span style={{ fontSize: "0.72rem", color: accent, fontWeight: 800 }}>대표번호 {hospitalInfo.phone}</span>
      </div>
    </div>
  );
}

// ─── 레이아웃 미리보기 썸네일 ────────────────────────────────
function LayoutThumb({ docCount, direction, selected, accent, onClick }) {
  const border = selected ? `2px solid ${accent}` : "2px solid #E5E7EB";
  const bg = selected ? `${accent}0D` : "#FAFAFA";
  const cardC = selected ? accent : "#CBD5E1";
  const listC = selected ? `${accent}40` : "#E2E8F0";
  const noticeC = selected ? `${accent}25` : "#EEF2F7";
  const W = 96,
    H = 60,
    pad = 5;
  let rects = [];

  if (docCount === 1) {
    if (direction === "horizontal") {
      // 카드(좌, 좁) + 목록(중) + 공지(우, 좁)
      rects = [
        { x: pad, y: pad, w: 20, h: H - pad * 2, fill: cardC, r: 3 },
        { x: pad + 23, y: pad, w: W - pad * 2 - 23 - 20, h: H - pad * 2, fill: listC, r: 3 },
        { x: W - pad - 17, y: pad, w: 17, h: H - pad * 2, fill: noticeC, r: 3 },
      ];
    } else {
      // 카드(위, 얇) + 목록(아래)  — 세로는 공지 없음
      rects = [
        { x: pad, y: pad, w: W - pad * 2, h: 16, fill: cardC, r: 3 },
        { x: pad, y: pad + 19, w: W - pad * 2, h: H - pad * 2 - 19, fill: listC, r: 3 },
      ];
    }
  } else {
    if (direction === "horizontal") {
      const rowH = Math.floor((H - pad * 2 - 4) / 2);
      [0, 1].forEach((i) => {
        const y = pad + i * (rowH + 4);
        rects.push({ x: pad, y, w: 18, h: rowH, fill: cardC, r: 2 });
        rects.push({ x: pad + 21, y, w: W - pad * 2 - 21, h: rowH, fill: listC, r: 2 });
      });
    } else {
      const colW = Math.floor((W - pad * 2 - 4) / 2);
      [0, 1].forEach((i) => {
        const x = pad + i * (colW + 4);
        rects.push({ x, y: pad, w: colW, h: 16, fill: cardC, r: 2 });
        rects.push({ x, y: pad + 19, w: colW, h: H - pad * 2 - 19, fill: listC, r: 2 });
      });
    }
  }

  const labels = { horizontal: "가로 배치", vertical: "세로 배치" };

  return (
    <button
      onClick={onClick}
      style={{ border, background: bg, borderRadius: "14px", padding: "12px 10px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "all 0.18s", outline: "none" }}
    >
      <svg width={W} height={H} style={{ borderRadius: "6px", background: "#F8FAFC" }}>
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx={r.r} fill={r.fill} />
        ))}
      </svg>
      <div style={{ fontSize: "0.68rem", fontWeight: selected ? 800 : 600, color: selected ? accent : "#6B7280", textAlign: "center" }}>
        {labels[direction]}
        {docCount === 1 && direction === "horizontal" ? " + 공지" : ""}
      </div>
    </button>
  );
}

// ─── 설정 모달 ───────────────────────────────────────────────
function SettingsModal({ departments, onClose, onApply, currentDeptId, currentDoctorId, currentDeptId2, currentDoctorId2, currentColor, currentColorB, currentDocCount, currentDirection }) {
  const [tab, setTab] = useState("display");
  const [selDept, setSelDept] = useState(currentDeptId);
  const [selDoctor, setSelDoctor] = useState(currentDoctorId);
  const [selDept2, setSelDept2] = useState(currentDeptId2);
  const [selDoctor2, setSelDoctor2] = useState(currentDoctorId2);
  const [selColor, setSelColor] = useState(currentColor);
  const [selColorB, setSelColorB] = useState(currentColorB);
  const [docCount, setDocCount] = useState(currentDocCount);
  const [direction, setDirection] = useState(currentDirection);
  const [colorTarget, setColorTarget] = useState("A"); // "A" | "B"

  const canApply =
    tab === "display" ? (docCount === 1 ? selDept && selDoctor : selDept && selDoctor && selDept2 && selDoctor2) : true;

  const handleApply = () => {
    if (!canApply) return;
    onApply({ deptId: selDept, doctorId: selDoctor, deptId2: selDept2, doctorId2: selDoctor2, color: selColor, colorB: selColorB, docCount, direction });
  };

  const TABS = [
    ["display", "🖥️ 디스플레이"],
    ["color", "🎨 컬러 테마"],
  ];

  // 의사 선택 공통 UI
  const DoctorPicker = ({ selD, setD, selDoc, setDoc, label }) => {
    const d = departments.find((x) => x.id === selD);
    return (
      <>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", marginBottom: "10px" }}>{label}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => {
                setD(dept.id);
                setDoc(null);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                border: selD === dept.id ? `2px solid ${dept.accentColor}` : "2px solid #F3F4F6",
                background: selD === dept.id ? `${dept.accentColor}10` : "#FAFAFA",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: selD === dept.id ? dept.accentColor : "#374151" }}>{dept.name}</div>
              <div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{dept.doctors.length}명</div>
            </button>
          ))}
        </div>
        {d && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
            {d.doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setDoc(doc.id)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: selDoc === doc.id ? `2px solid ${d.accentColor}` : "2px solid #F3F4F6",
                  background: selDoc === doc.id ? `${d.accentColor}10` : "#FAFAFA",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={doc.photoUrl}
                  alt=""
                  style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${selDoc === doc.id ? d.accentColor : "#E5E7EB"}` }}
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: selDoc === doc.id ? d.accentColor : "#111827" }}>
                    {doc.name}
                    <span style={{ fontSize: "0.62rem", color: "#9CA3AF", fontWeight: 400, marginLeft: "5px" }}>{doc.title}</span>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        marginLeft: "6px",
                        padding: "1px 6px",
                        borderRadius: "20px",
                        color: doc.status === "진료중" ? "#059669" : "#D97706",
                        background: doc.status === "진료중" ? "#ECFDF5" : "#FFFBEB",
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>
                    {doc.specialty} · {doc.room}
                  </div>
                </div>
                {selDoc === doc.id && (
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: d.accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#fff", flexShrink: 0 }}>✓</div>
                )}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "28px", width: "600px", maxWidth: "94vw", boxShadow: "0 24px 80px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", maxHeight: "90vh", overflow: "hidden" }}>
        {/* 모달 헤더 */}
        <div style={{ padding: "22px 28px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>🖥️ 소대기 화면 설정</div>
              <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "3px" }}>디스플레이 구성, 의사 선택 및 컬러 테마를 설정합니다</div>
            </div>
            <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F3F4F6", border: "none", cursor: "pointer", fontSize: "1rem", color: "#6B7280" }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "12px", padding: "4px" }}>
            {TABS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: "9px",
                  border: "none",
                  background: tab === id ? "#fff" : "transparent",
                  color: tab === id ? "#111827" : "#9CA3AF",
                  fontWeight: tab === id ? 700 : 500,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 바디 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {/* ── 디스플레이 탭 ── */}
          {tab === "display" && (
            <div>
              {/* STEP 1: 의사 수 */}
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", marginBottom: "12px" }}>STEP 1 · 의사 수</div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                {[1, 2].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDocCount(n)}
                    style={{
                      flex: 1,
                      padding: "14px 12px",
                      borderRadius: "14px",
                      border: docCount === n ? `2px solid ${selColor}` : "2px solid #E5E7EB",
                      background: docCount === n ? `${selColor}0D` : "#FAFAFA",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>{n === 1 ? "👤" : "👥"}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: docCount === n ? selColor : "#374151" }}>{n}명</span>
                    <span style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{n === 1 ? "단일 의사 화면" : "2인 동시 표시"}</span>
                  </button>
                ))}
              </div>

              {/* STEP 2: 레이아웃 방향 */}
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", marginBottom: "12px" }}>STEP 2 · 레이아웃 방향</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                {["horizontal", "vertical"].map((dir) => (
                  <LayoutThumb key={dir} docCount={docCount} direction={dir} selected={direction === dir} accent={selColor} onClick={() => setDirection(dir)} />
                ))}
              </div>

              {/* STEP 3: 의사 A */}
              <DoctorPicker selD={selDept} setD={setSelDept} selDoc={selDoctor} setDoc={setSelDoctor} label={`STEP 3 · ${docCount === 2 ? "의사 A" : "담당 의사"} 선택`} />

              {/* STEP 4: 의사 B (2명일 때) */}
              {docCount === 2 && <DoctorPicker selD={selDept2} setD={setSelDept2} selDoc={selDoctor2} setDoc={setSelDoctor2} label="STEP 4 · 의사 B 선택" />}
            </div>
          )}

          {/* ── 컬러 탭 ── */}
          {tab === "color" &&
            (() => {
              const isB = docCount === 2 && colorTarget === "B";
              const activeColor = isB ? selColorB : selColor;
              const setActiveColor = isB ? setSelColorB : setSelColor;
              const dept = isB ? departments.find((d) => d.id === selDept2) : departments.find((d) => d.id === selDept);
              const docName = isB
                ? dept?.doctors.find((d) => d.id === selDoctor2)?.name || "의사 B"
                : dept?.doctors.find((d) => d.id === selDoctor)?.name || "의사 A";
              const deptName = dept?.name || "";
              return (
                <div>
                  {/* 2명일 때 A/B 탭 */}
                  {docCount === 2 && (
                    <div style={{ display: "flex", gap: "6px", background: "#F3F4F6", borderRadius: "10px", padding: "4px", marginBottom: "16px" }}>
                      {["A", "B"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setColorTarget(t)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            background: colorTarget === t ? "#fff" : "transparent",
                            color: colorTarget === t ? "#111827" : "#9CA3AF",
                            fontWeight: colorTarget === t ? 700 : 500,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            boxShadow: colorTarget === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                          }}
                        >
                          의사 {t} 컬러
                        </button>
                      ))}
                    </div>
                  )}
                  {/* 미리보기 */}
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", marginBottom: "10px" }}>미리보기</div>
                  <div style={{ borderRadius: "18px", padding: "20px", background: `linear-gradient(135deg, ${activeColor} 0%, ${activeColor}99 100%)`, marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>👨‍⚕️</div>
                    <div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>
                        {docName} <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>과장</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", marginTop: "3px" }}>{deptName}</div>
                    </div>
                  </div>
                  {/* 프리셋 */}
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", marginBottom: "10px" }}>컬러 프리셋</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginBottom: "20px" }}>
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        onClick={() => setActiveColor(p.color)}
                        style={{
                          padding: "10px 8px",
                          borderRadius: "12px",
                          border: "none",
                          background: activeColor === p.color ? `${p.color}15` : "#FAFAFA",
                          outline: activeColor === p.color ? `2px solid ${p.color}` : "2px solid transparent",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <div style={{ width: "100%", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${p.color} 0%, ${p.color}88 100%)` }} />
                        <span style={{ fontSize: "0.62rem", fontWeight: activeColor === p.color ? 700 : 500, color: activeColor === p.color ? p.color : "#6B7280" }}>{p.label}</span>
                      </button>
                    ))}
                  </div>
                  {/* 직접 입력 */}
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", marginBottom: "10px" }}>직접 입력</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#FAFAFA", borderRadius: "14px", border: "1.5px solid #E5E7EB" }}>
                    <input type="color" value={activeColor} onChange={(e) => setActiveColor(e.target.value)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "none", cursor: "pointer", padding: "2px" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>커스텀 컬러</div>
                      <div style={{ fontSize: "0.68rem", color: "#9CA3AF", marginTop: "1px" }}>원하는 색상을 직접 선택하세요</div>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", fontFamily: "monospace" }}>{activeColor.toUpperCase()}</span>
                  </div>
                </div>
              );
            })()}
        </div>

        {/* 모달 푸터 */}
        <div style={{ padding: "0 28px 24px", flexShrink: 0 }}>
          <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "16px" }} />
          <button
            onClick={handleApply}
            disabled={!canApply}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: canApply ? selColor : "#E5E7EB",
              color: canApply ? "#fff" : "#9CA3AF",
              fontSize: "0.9rem",
              fontWeight: 800,
              cursor: canApply ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            {canApply ? "✓  설정 적용" : "설정을 완료해 주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 상태 뱃지 (인라인) ──────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    진료중: { color: "#059669", bg: "#ECFDF5" },
    수술중: { color: "#D97706", bg: "#FFFBEB" },
    대기중: { color: "#D97706", bg: "#FFFBEB" },
    휴진: { color: "#94A3B8", bg: "#F1F5F9" },
  };
  const s = map[status] || map["대기중"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", fontWeight: 800, color: s.color, background: s.bg, padding: "2px 8px 2px 6px", borderRadius: "20px", verticalAlign: "middle", alignSelf: "flex-start" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: s.color, display: "inline-block", animation: status !== "휴진" ? "pulse 1.6s ease-in-out infinite" : "none" }} />
      {status}
    </span>
  );
}

// ─── 의사 카드: 풀 (1명·가로, 1명·세로) ─────────────────────
function DoctorCardFull({ doctor, deptName, accent, waitingCount, currentPatient }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{ background: `linear-gradient(160deg, ${accent}EE 0%, ${accent}BB 100%)`, borderRadius: "20px", padding: "22px 20px", boxShadow: `0 4px 20px ${accent}45`, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden", flex: 1 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

      <div style={{ flex: 1 }} />

      {/* 사진 */}
      <div style={{ marginBottom: "14px", zIndex: 1 }}>
        <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "2.5px solid rgba(255,255,255,0.6)", boxShadow: "0 0 0 4px rgba(255,255,255,0.12), 0 6px 20px rgba(0,0,0,0.2)", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!imgError && doctor.photoUrl ? (
            <img src={doctor.photoUrl} alt={doctor.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff" }}>{doctor.name.slice(0, 2)}</span>
          )}
        </div>
      </div>

      {/* 이름·직급·뱃지 */}
      <div style={{ textAlign: "center", zIndex: 1, width: "100%" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {doctor.name}
          <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginLeft: "6px" }}>{doctor.title}</span>
          <span style={{ marginLeft: "8px" }}>
            <StatusBadge status={doctor.status} />
          </span>
        </div>
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "5px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.22)", padding: "3px 10px", borderRadius: "20px" }}>{deptName}</span>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: "20px" }}>{doctor.room}</span>
        </div>
        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", marginTop: "6px" }}>{doctor.specialty}</div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.2)", margin: "0 0 14px", zIndex: 1 }} />

      {/* 대기 수 */}
      <div style={{ width: "100%", zIndex: 1, marginBottom: "12px" }}>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "14px", padding: "14px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.16em", marginBottom: "4px" }}>현재 대기 환자</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "3px" }}>
            <span style={{ fontSize: "3.6rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{waitingCount}</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>명</span>
          </div>
        </div>
      </div>

      {/* 진료중 환자 */}
      {currentPatient ? (
        <div style={{ width: "100%", zIndex: 1, background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(255,255,255,0.3)" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginBottom: "3px" }}>진료중</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#fff", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentPatient.name} 님</div>
          </div>
          <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "4px 9px", borderRadius: "8px", flexShrink: 0, color: "#fff", background: currentPatient.type === "초진" ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.2)" }}>{currentPatient.type}</span>
        </div>
      ) : (
        <div style={{ width: "100%", zIndex: 1, background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.25)" }}>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>대기 중</div>
        </div>
      )}
    </div>
  );
}

// ─── 의사 카드: 컴팩트 (2명용) ───────────────────────────────
function DoctorCardCompact({ doctor, deptName, accent, waitingCount, currentPatient, stretch }) {
  const [imgError, setImgError] = useState(false);
  const nameGlow = { textShadow: "0 0 24px rgba(255,255,255,0.55), 0 2px 8px rgba(0,0,0,0.3)" };

  // ── 세로 배치용 ──
  if (!stretch) {
    return (
      <div style={{ background: `linear-gradient(135deg, ${accent}EE 0%, ${accent}BB 100%)`, borderRadius: "16px", padding: "16px 20px", boxShadow: `0 4px 16px ${accent}40`, display: "flex", gap: "18px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "70px", background: "linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 100%)", pointerEvents: "none" }} />

        {/* 좌: 사진 + 상세정보 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0, zIndex: 1 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)`, animation: "pulse 2.5s ease-in-out infinite" }} />
            <div style={{ width: "86px", height: "86px", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.7)", boxShadow: `0 0 0 5px rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.25), 0 0 30px ${accent}60`, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
              {!imgError && doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt={doctor.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>{doctor.name.slice(0, 2)}</span>
              )}
            </div>
          </div>
          {/* 상세정보 (사진 아래) */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.65)", fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
              {deptName} · {doctor.room}
            </div>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginTop: "2px", whiteSpace: "nowrap" }}>{doctor.specialty}</div>
          </div>
        </div>

        {/* 우: 이름 + 직급 + 뱃지 */}
        <div style={{ flex: 1, zIndex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
          <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", ...nameGlow }}>{doctor.name}</div>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{doctor.title}</div>
          <StatusBadge status={doctor.status} />
        </div>
      </div>
    );
  }

  // ── 가로 배치용 (stretch) ──
  return (
    <div style={{ background: `linear-gradient(135deg, ${accent}EE 0%, ${accent}BB 100%)`, borderRadius: "16px", padding: "18px 22px", boxShadow: `0 4px 16px ${accent}40`, display: "flex", gap: "22px", position: "relative", overflow: "hidden", alignSelf: "stretch", width: "100%" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)", pointerEvents: "none" }} />

      {/* 좌: 사진 + 상세정보 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0, zIndex: 1, justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)`, animation: "pulse 2.5s ease-in-out infinite" }} />
          <div style={{ width: "108px", height: "108px", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.75)", boxShadow: `0 0 0 6px rgba(255,255,255,0.12), 0 10px 30px rgba(0,0,0,0.25), 0 0 40px ${accent}60`, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
            {!imgError && doctor.photoUrl ? (
              <img src={doctor.photoUrl} alt={doctor.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "1.7rem", fontWeight: 900, color: "#fff" }}>{doctor.name.slice(0, 2)}</span>
            )}
          </div>
        </div>
        {/* 상세정보 (사진 아래) */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
            {deptName} · {doctor.room}
          </div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: "3px", whiteSpace: "nowrap" }}>{doctor.specialty}</div>
        </div>
      </div>

      {/* 우: 이름 + 직급 + 뱃지 */}
      <div style={{ flex: 1, zIndex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
        <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.03em", ...nameGlow }}>{doctor.name}</div>
        <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{doctor.title}</div>
        <StatusBadge status={doctor.status} />
      </div>
    </div>
  );
}

// ─── 환자 행 ─────────────────────────────────────────────────
function PatientRow({ patient, rank, accent }) {
  const isActive = patient.status === "진료중";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 130px 1fr 52px 42px 62px", alignItems: "center", padding: "13px 16px", borderRadius: "12px", marginBottom: "5px", gap: "8px", background: isActive ? `${accent}0D` : "#FAFAFA", border: isActive ? `1.5px solid ${accent}35` : "1.5px solid transparent", boxShadow: isActive ? `0 0 0 3px ${accent}08` : "none", position: "relative", overflow: "hidden" }}>
      {isActive && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,transparent,${accent}08,transparent)`, animation: "scan 2.5s ease-in-out infinite", pointerEvents: "none", borderRadius: "12px" }} />}
      <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: isActive ? accent : "#E5E7EB", color: isActive ? "#fff" : "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 800, boxShadow: isActive ? `0 3px 8px ${accent}50` : "none", zIndex: 1 }}>{isActive ? "▶" : rank}</div>
      <div style={{ fontSize: "1rem", fontWeight: 800, color: isActive ? accent : "#374151", letterSpacing: "0.03em", zIndex: 1 }}>{patient.number}</div>
      <div style={{ fontSize: "1.05rem", fontWeight: isActive ? 800 : 600, color: isActive ? "#111827" : "#374151", zIndex: 1 }}>{patient.name} 님</div>
      <div style={{ fontSize: "0.9rem", color: "#6B7280", zIndex: 1 }}>{patient.age}세</div>
      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: patient.gender === "여" ? "#DB2777" : "#2563EB", background: patient.gender === "여" ? "#FDF2F8" : "#EFF6FF", padding: "3px 7px", borderRadius: "7px", textAlign: "center", zIndex: 1 }}>{patient.gender}</div>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "3px 9px", borderRadius: "7px", color: patient.type === "초진" ? "#7C3AED" : "#374151", background: patient.type === "초진" ? "#F5F3FF" : "#F3F4F6" }}>{patient.type}</span>
      </div>
    </div>
  );
}

// ─── 대기 목록 박스 ───────────────────────────────────────────
const ROWS_PER_PAGE = 6;
const PAGE_MS = 5000;

function WaitingList({ doctor, accent, showWaitingBadge }) {
  const [page, setPage] = useState(0);
  const [pageKey, setPageKey] = useState(0);
  const current = doctor.patients.find((p) => p.status === "진료중") || null;
  const waiting = doctor.patients.filter((p) => p.status === "대기");
  const totalPages = Math.max(1, Math.ceil(waiting.length / ROWS_PER_PAGE));
  const pageWaiting = waiting.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  useEffect(() => {
    if (totalPages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
      setPageKey((k) => k + 1);
    }, PAGE_MS);
    return () => clearInterval(id);
  }, [totalPages, doctor.id]);

  useEffect(() => {
    setPage(0);
    setPageKey(0);
  }, [doctor.id]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", minHeight: 0, minWidth: 0 }}>
      {/* 리스트 헤더 */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>대기 환자 목록</div>
          <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>
            총 <strong style={{ color: accent }}>{doctor.patients.length}</strong>명 · 대기 <strong style={{ color: "#F59E0B" }}>{waiting.length}</strong>명
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div key={i} style={{ width: i === page ? "16px" : "5px", height: "5px", borderRadius: "3px", background: i === page ? accent : "#E5E7EB", transition: "all 0.3s" }} />
              ))}
            </div>
          )}
          {showWaitingBadge ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: `${accent}10`, border: `1.5px solid ${accent}30`, borderRadius: "10px", padding: "5px 14px" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7280" }}>대기</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: accent, lineHeight: 1 }}>{waiting.length}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7280" }}>명</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", animation: "pulse 1.8s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>실시간</span>
            </div>
          )}
        </div>
      </div>
      {/* 컬럼 헤더 */}
      <div style={{ display: "grid", gridTemplateColumns: "44px 130px 1fr 52px 42px 62px", padding: "7px 16px", gap: "8px", background: "#FAFAFA", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
        {["순번", "등록번호", "환자명", "나이", "성별", "구분"].map((h, i) => (
          <div key={h} style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textAlign: i >= 4 ? "center" : "left" }}>
            {h}
          </div>
        ))}
      </div>
      {/* 진료중 환자 배너 */}
      {current && (
        <div style={{ margin: "10px 12px 0", flexShrink: 0, background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`, border: `2px solid ${accent}40`, borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", position: "relative", overflow: "hidden" }}>
          {/* 배경 펄스 */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${accent}0A, transparent)`, animation: "scan 3s ease-in-out infinite", borderRadius: "14px", pointerEvents: "none" }} />
          {/* 아이콘 */}
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${accent}50`, zIndex: 1 }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fff", animation: "pulse 1.2s ease-in-out infinite" }} />
          </div>
          {/* 텍스트 */}
          <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: accent, letterSpacing: "0.14em", marginBottom: "2px" }}>🔴 진료중</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#111827", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current.name} 님</div>
          </div>
          {/* 등록번호 + 구분 */}
          <div style={{ textAlign: "right", flexShrink: 0, zIndex: 1 }}>
            <div style={{ fontSize: "0.62rem", color: "#9CA3AF", marginBottom: "3px" }}>{current.number}</div>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "4px 10px", borderRadius: "8px", color: current.type === "초진" ? "#7C3AED" : "#374151", background: current.type === "초진" ? "#F5F3FF" : "#F3F4F6" }}>{current.type}</span>
          </div>
        </div>
      )}
      {current && waiting.length > 0 && (
        <div style={{ margin: "8px 20px 0", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <div style={{ flex: 1, height: "1px", background: "#F3F4F6" }} />
          <span style={{ fontSize: "0.62rem", color: "#D1D5DB", fontWeight: 600 }}>대기 환자</span>
          <div style={{ flex: 1, height: "1px", background: "#F3F4F6" }} />
        </div>
      )}
      {/* 대기 목록 */}
      <div key={pageKey} style={{ flex: 1, padding: "4px 8px 10px", animation: "pageIn 0.35s ease-out", overflowY: "auto" }}>
        {pageWaiting.length > 0 ? (
          pageWaiting.map((p) => <PatientRow key={p.number} patient={p} rank={waiting.indexOf(p) + 1} accent={accent} />)
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "8px", paddingTop: "30px" }}>
            <div style={{ fontSize: "2rem" }}>🙌</div>
            <div style={{ fontSize: "0.82rem", color: "#9CA3AF", fontWeight: 600 }}>현재 대기 환자가 없습니다</div>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ padding: "7px 20px 10px", borderTop: "1px solid #F3F4F6", textAlign: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>
            {page + 1} / {totalPages} 페이지 · {PAGE_MS / 1000}초마다 자동 전환
          </span>
        </div>
      )}
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  deptId: "dept-1",
  doctorId: "doc-1",
  deptId2: "dept-3",
  doctorId2: "doc-4",
  color: null,
  colorB: null,
  docCount: 1,
  direction: "horizontal",
};

export default function SmallWaitingMonitor() {
  const [departments, setDepartments] = useState(null);
  const [notices, setNotices] = useState([]);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useLocalStorage("hm_small_settings", DEFAULT_SETTINGS);

  useEffect(() => {
    Promise.all([fetchDepartments(), fetchNotices(), fetchHospitalInfo()]).then(([depts, ntc, info]) => {
      setDepartments(depts);
      setNotices(ntc);
      setHospitalInfo(info);
    });
  }, []);

  // 저장된 설정의 의사가 데이터에 없으면(퇴사 등) 기본 설정으로 복원
  const doctorMissing =
    departments != null &&
    !departments.find((d) => d.id === settings.deptId)?.doctors.find((x) => x.id === settings.doctorId);
  useEffect(() => {
    if (doctorMissing) setSettings(DEFAULT_SETTINGS);
  }, [doctorMissing]);

  if (!departments || !hospitalInfo) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "0.9rem" }}>
        대기 현황을 불러오는 중…
      </div>
    );
  }

  const { deptId, doctorId, deptId2, doctorId2, color, colorB, docCount, direction } = settings;

  const deptA = departments.find((d) => d.id === deptId);
  const doctorA = deptA?.doctors.find((d) => d.id === doctorId);
  const deptB = departments.find((d) => d.id === deptId2);
  const doctorB = deptB?.doctors.find((d) => d.id === doctorId2);
  const accentA = color || deptA?.accentColor || "#2563EB";
  const accentB = colorB || deptB?.accentColor || "#DC2626";

  const waitingA = doctorA?.patients.filter((p) => p.status === "대기") || [];
  const waitingB = doctorB?.patients.filter((p) => p.status === "대기") || [];
  const currentA = doctorA?.patients.find((p) => p.status === "진료중") || null;
  const currentB = doctorB?.patients.find((p) => p.status === "진료중") || null;

  const handleApply = (next) => {
    setSettings((prev) => ({ ...prev, ...next }));
    setShowSettings(false);
  };

  if (!doctorA) return null;

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#F1F5F9", display: "flex", flexDirection: "column" }}>
      {showSettings && (
        <SettingsModal
          departments={departments}
          onClose={() => setShowSettings(false)}
          onApply={handleApply}
          currentDeptId={deptId}
          currentDoctorId={doctorId}
          currentDeptId2={deptId2}
          currentDoctorId2={doctorId2}
          currentColor={accentA}
          currentColorB={accentB}
          currentDocCount={docCount}
          currentDirection={direction}
        />
      )}

      {/* 헤더 */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => setShowSettings(true)}
            title="대기 화면 설정"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            }}
          >
            🏥
          </button>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{hospitalInfo.name}</div>
            <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "3px", letterSpacing: "0.05em" }}>
              {docCount === 1 ? (
                <>
                  <span style={{ color: accentA, fontWeight: 700 }}>{deptA.name}</span> · 소대기 현황판
                </>
              ) : (
                <>
                  <span style={{ color: accentA, fontWeight: 700 }}>{deptA.name}</span> · <span style={{ color: accentB, fontWeight: 700 }}>{deptB?.name}</span> · 소대기 현황판
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <BoardNav />
          <Clock />
        </div>
      </div>

      {/* ══ 본문 ══ */}

      {/* 1명 · 가로: [카드(풀) | 목록] [공지] */}
      {docCount === 1 && direction === "horizontal" && (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "280px 1fr 220px", gap: "18px", padding: "18px", minHeight: 0 }}>
          <DoctorCardFull doctor={doctorA} deptName={deptA.name} accent={accentA} waitingCount={waitingA.length} currentPatient={currentA} />
          <WaitingList doctor={doctorA} accent={accentA} />
          <NoticePanel accent={accentA} notices={notices} hospitalInfo={hospitalInfo} />
        </div>
      )}

      {/* 1명 · 세로: 컴팩트카드(위, 고정높이) + 목록(아래, 나머지 전체) */}
      {docCount === 1 && direction === "vertical" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "18px", padding: "18px", minHeight: 0 }}>
          <DoctorCardCompact doctor={doctorA} deptName={deptA.name} accent={accentA} waitingCount={waitingA.length} currentPatient={currentA} />
          <WaitingList doctor={doctorA} accent={accentA} />
        </div>
      )}

      {/* 2명 · 가로: 상하 2행, 각 행 [컴팩트카드 | 목록] — 높이 균등 */}
      {docCount === 2 && direction === "horizontal" && doctorB && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", padding: "18px", minHeight: 0 }}>
          <div style={{ flex: 1, display: "flex", gap: "14px", minHeight: 0 }}>
            <div style={{ width: "340px", flexShrink: 0, display: "flex" }}>
              <DoctorCardCompact doctor={doctorA} deptName={deptA.name} accent={accentA} waitingCount={waitingA.length} currentPatient={currentA} stretch />
            </div>
            <WaitingList doctor={doctorA} accent={accentA} showWaitingBadge />
          </div>
          <div style={{ flex: 1, display: "flex", gap: "14px", minHeight: 0 }}>
            <div style={{ width: "340px", flexShrink: 0, display: "flex" }}>
              <DoctorCardCompact doctor={doctorB} deptName={deptB.name} accent={accentB} waitingCount={waitingB.length} currentPatient={currentB} stretch />
            </div>
            <WaitingList doctor={doctorB} accent={accentB} showWaitingBadge />
          </div>
        </div>
      )}

      {/* 2명 · 세로: 좌우 2열, 각 열 [컴팩트카드(위) / 목록(아래)] */}
      {docCount === 2 && direction === "vertical" && doctorB && (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", padding: "18px", minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: 0 }}>
            <DoctorCardCompact doctor={doctorA} deptName={deptA.name} accent={accentA} waitingCount={waitingA.length} currentPatient={currentA} />
            <WaitingList doctor={doctorA} accent={accentA} showWaitingBadge />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: 0 }}>
            <DoctorCardCompact doctor={doctorB} deptName={deptB.name} accent={accentB} waitingCount={waitingB.length} currentPatient={currentB} />
            <WaitingList doctor={doctorB} accent={accentB} showWaitingBadge />
          </div>
        </div>
      )}

      {/* 푸터 */}
      <div style={{ background: "#fff", padding: "10px 24px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
          문의 · 원무과 {doctorA.phone}
          {docCount === 2 && doctorB ? ` | ${doctorB.phone}` : ""} | {hospitalInfo.name}
        </span>
        <span style={{ fontSize: "0.68rem", color: "#D1D5DB" }}>업데이트 {new Date().toLocaleTimeString("ko-KR")}</span>
      </div>
    </div>
  );
}
