import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import BoardNav from "../components/BoardNav";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchDepartments, fetchNotices } from "../api/dataService";

function DoctorPanel({ doctor }) {
  const waiting = doctor.patients.filter((p) => p.status === "대기").length;
  const current = doctor.patients.find((p) => p.status === "진료중");

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Doctor Header */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          background: `linear-gradient(135deg, ${doctor.accentColor}06 0%, transparent 100%)`,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: `${doctor.accentColor}14`,
            border: `1.5px solid ${doctor.accentColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.85rem",
            color: doctor.accentColor,
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          {doctor.avatar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{doctor.name}</span>
            <span style={{ fontSize: "0.65rem", color: "#6B7280", fontWeight: 600, background: "#F3F4F6", padding: "2px 7px", borderRadius: "6px" }}>{doctor.title}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "1px" }}>
            <span style={{ color: doctor.accentColor, fontWeight: 700 }}>{doctor.dept}</span>
            <span style={{ margin: "0 5px", color: "#D1D5DB" }}>·</span>
            <span>{doctor.specialty}</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{doctor.room}</div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: "20px",
              color: doctor.status === "진료중" ? "#059669" : "#D97706",
              background: doctor.status === "진료중" ? "#ECFDF5" : "#FFFBEB",
              letterSpacing: "0.05em",
              marginBottom: "5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "currentColor",
                display: "inline-block",
                animation: doctor.status === "진료중" ? "dot 1.5s ease-in-out infinite" : "none",
              }}
            />
            {doctor.status}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#374151" }}>
            대기 <strong style={{ color: doctor.accentColor, fontSize: "1.1rem" }}>{waiting}</strong>명
          </div>
        </div>
      </div>

      {/* Current Patient Banner */}
      {current && (
        <div
          style={{
            margin: "10px 12px 0",
            padding: "9px 14px",
            background: `${doctor.accentColor}08`,
            border: `1px solid ${doctor.accentColor}20`,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: doctor.accentColor, animation: "dot 1.5s ease-in-out infinite", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "0.7rem", color: "#9CA3AF", marginRight: "8px" }}>현재 진료중</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{current.number}</span>
            <span style={{ fontSize: "0.82rem", color: "#374151", marginLeft: "8px" }}>{current.name} 님</span>
          </div>
          <span style={{ fontSize: "0.65rem", color: doctor.accentColor, fontWeight: 600, background: `${doctor.accentColor}12`, padding: "2px 8px", borderRadius: "6px" }}>{current.type}</span>
        </div>
      )}

      {/* Patient List */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px 12px 12px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "26px 96px 1fr 38px 34px 52px",
            padding: "5px 8px",
            marginBottom: "3px",
            gap: "4px",
          }}
        >
          {["순", "번호", "이름", "나이", "성별", "구분"].map((h, i) => (
            <div
              key={h}
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#9CA3AF",
                letterSpacing: "0.1em",
                textAlign: i >= 5 ? "center" : "left",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {doctor.patients.map((p, i) => {
          const isActive = p.status === "진료중";
          return (
            <div
              key={p.number}
              style={{
                display: "grid",
                gridTemplateColumns: "26px 96px 1fr 38px 34px 52px",
                alignItems: "center",
                padding: "8px 8px",
                borderRadius: "10px",
                marginBottom: "2px",
                gap: "4px",
                background: isActive ? `${doctor.accentColor}08` : i % 2 === 0 ? "#FAFAFA" : "#FFFFFF",
                border: isActive ? `1px solid ${doctor.accentColor}20` : "1px solid transparent",
                transition: "background 0.2s",
              }}
            >
              <div style={{ fontSize: "0.7rem", color: "#9CA3AF", fontWeight: 600 }}>{isActive ? "▶" : String(i + 1).padStart(2, "0")}</div>
              <div
                style={{
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: isActive ? doctor.accentColor : "#374151",
                  letterSpacing: "0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {p.number}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: isActive ? "#111827" : "#374151" }}>{p.name}</div>
              <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>{p.age}세</div>
              <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{p.gender}</div>
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    color: p.type === "초진" ? "#7C3AED" : "#374151",
                    background: p.type === "초진" ? "#F5F3FF" : "#F3F4F6",
                  }}
                >
                  {p.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 의사 선택 모달
function DoctorSelectModal({ allDoctors, depts, onClose, selectedIds, onApply }) {
  const [localSelected, setLocalSelected] = useState(new Set(selectedIds));
  const [activeDept, setActiveDept] = useState("전체");

  const deptList = ["전체", ...depts];
  const filtered = activeDept === "전체" ? allDoctors : allDoctors.filter((d) => d.dept === activeDept);

  const toggle = (id) => {
    setLocalSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleDept = (dept) => {
    const ids = allDoctors.filter((d) => d.dept === dept).map((d) => d.id);
    const allSelected = ids.every((id) => localSelected.has(id));
    setLocalSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const selectAll = () => setLocalSelected(new Set(allDoctors.map((d) => d.id)));
  const clearAll = () => setLocalSelected(new Set());

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.18s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          width: "640px",
          maxWidth: "95vw",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          animation: "slideUp 0.22s ease-out",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFF 100%)",
          }}
        >
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>대기 모니터 의사 설정</div>
            <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "3px" }}>
              화면에 표시할 의사를 선택하세요 ({localSelected.size}/{allDoctors.length}명 선택됨)
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              cursor: "pointer",
              fontSize: "1.1rem",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Dept tabs + quick actions */}
        <div style={{ padding: "14px 24px 0", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {deptList.map((dept) => {
                const isActive = activeDept === dept;
                const deptDocs = dept === "전체" ? allDoctors : allDoctors.filter((d) => d.dept === dept);
                const allChecked = dept !== "전체" && deptDocs.every((d) => localSelected.has(d.id));
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      setActiveDept(dept);
                      if (dept !== "전체") toggleDept(dept);
                    }}
                    style={{
                      padding: "5px 13px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      border: isActive ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
                      background: isActive ? "#2563EB" : allChecked ? "#EFF6FF" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : allChecked ? "#2563EB" : "#374151",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {dept}
                    {dept !== "전체" && allChecked && <span style={{ fontSize: "0.6rem" }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={selectAll} style={{ fontSize: "0.7rem", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                전체선택
              </button>
              <span style={{ color: "#E5E7EB" }}>|</span>
              <button onClick={clearAll} style={{ fontSize: "0.7rem", color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                전체해제
              </button>
            </div>
          </div>
        </div>

        {/* Doctor list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {filtered.map((doc) => {
              const checked = localSelected.has(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggle(doc.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: checked ? `2px solid ${doc.accentColor}` : "2px solid #F3F4F6",
                    background: checked ? `${doc.accentColor}06` : "#FAFAFA",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "11px",
                      flexShrink: 0,
                      background: checked ? `${doc.accentColor}18` : "#EFEFEF",
                      border: checked ? `1.5px solid ${doc.accentColor}30` : "1.5px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      color: checked ? doc.accentColor : "#9CA3AF",
                      transition: "all 0.15s",
                    }}
                  >
                    {doc.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: checked ? "#111827" : "#374151" }}>{doc.name}</span>
                      <span style={{ fontSize: "0.62rem", color: "#9CA3AF", background: "#F3F4F6", padding: "1px 5px", borderRadius: "4px" }}>{doc.title}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: checked ? doc.accentColor : "#9CA3AF" }}>{doc.dept}</div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{doc.room}</div>
                  </div>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      flexShrink: 0,
                      background: checked ? doc.accentColor : "#FFFFFF",
                      border: checked ? `2px solid ${doc.accentColor}` : "2px solid #D1D5DB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {checked && <span style={{ color: "#FFFFFF", fontSize: "0.65rem", fontWeight: 900 }}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            background: "#FAFAFA",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 700,
              border: "1.5px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            onClick={() => {
              onApply([...localSelected]);
              onClose();
            }}
            style={{
              padding: "10px 28px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 700,
              border: "none",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            적용 ({localSelected.size}명)
          </button>
        </div>
      </div>
    </div>
  );
}

// 공지사항 마퀴
function NoticeMarquee({ notices }) {
  const text = notices.map((n) => n.text).join("     ★     ");
  return (
    <div
      style={{
        background: "#1E3A8A",
        padding: "0 24px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        flexShrink: 0,
        gap: "12px",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.65rem",
          fontWeight: 800,
          color: "#93C5FD",
          letterSpacing: "0.12em",
          whiteSpace: "nowrap",
          paddingRight: "20px",
          borderRight: "1px solid rgba(147,197,253,0.3)",
          marginRight: "4px",
        }}
      >
        <span style={{ fontSize: "0.7rem" }}>📢</span> 공지사항
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "marquee 45s linear infinite",
            fontSize: "0.76rem",
            color: "#DBEAFE",
            letterSpacing: "0.02em",
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

export default function LargeWaitingMonitor() {
  const [departments, setDepartments] = useState(null);
  const [notices, setNotices] = useState([]);
  const [selectedIds, setSelectedIds] = useLocalStorage("hm_main_selected", null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([fetchDepartments(), fetchNotices()]).then(([depts, ntc]) => {
      setDepartments(depts);
      setNotices(ntc);
    });
  }, []);

  if (!departments) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "0.9rem" }}>
        대기 현황을 불러오는 중…
      </div>
    );
  }

  // 진료과 정보를 의사 단위로 평탄화 (대대기 화면은 의사 카드 그리드로 표시)
  const allDoctors = departments.flatMap((dept) =>
    dept.doctors.map((doc) => ({ ...doc, dept: dept.name, deptEn: dept.deptEn, accentColor: dept.accentColor }))
  );
  const depts = [...new Set(allDoctors.map((d) => d.dept))];
  // 저장된 선택이 없으면 전체 표시
  const effectiveIds = selectedIds ?? allDoctors.map((d) => d.id);
  const displayedDoctors = allDoctors.filter((d) => effectiveIds.includes(d.id));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F1F5F9",
        color: "#111827",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* 로고 아이콘만 클릭 시 모달 열기 */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            onClick={() => setShowModal(true)}
            title="클릭하여 표시 의사 선택"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.07)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(37,99,235,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.25)";
            }}
          >
            🏥
          </div>
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>롯데병원</div>
            <div style={{ fontSize: "0.7rem", color: "#9CA3AF", letterSpacing: "0.08em", marginTop: "1px" }}>
              SEOUL CENTRAL HOSPITAL &nbsp;·&nbsp; 외래 진료 대기 현황
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <BoardNav />
          <Clock />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        {displayedDoctors.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              color: "#9CA3AF",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏥</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>표시할 의사가 없습니다</div>
            <div style={{ fontSize: "0.8rem" }}>좌측 상단 로고를 클릭하여 의사를 선택해 주세요.</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "18px",
              alignItems: "start",
            }}
          >
            {displayedDoctors.map((doc, i) => (
              <div key={doc.id} style={{ animation: `fadeUp 0.5s ease-out ${i * 0.08}s both` }}>
                <DoctorPanel doctor={doc} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 공지사항 마퀴 (하단 고정) */}
      <NoticeMarquee notices={notices} />

      {/* 의사 선택 모달 */}
      {showModal && (
        <DoctorSelectModal
          allDoctors={allDoctors}
          depts={depts}
          selectedIds={effectiveIds}
          onApply={setSelectedIds}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
