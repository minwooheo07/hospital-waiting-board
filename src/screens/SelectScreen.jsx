import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const BOARDS = [
  {
    key: "main",
    icon: "🖥️",
    title: "대대기 전광판",
    subtitle: "외래 로비 · 대형 스크린",
    desc: "여러 진료과 의사의 대기 현황을 한 화면에 모아 표시합니다. 접수 창구와 중앙 로비에 적합합니다.",
    accent: "#2563EB",
  },
  {
    key: "small",
    icon: "📺",
    title: "소대기 전광판",
    subtitle: "진료실 앞 · 개별 모니터",
    desc: "의사 1~2명의 대기 목록을 크게 표시합니다. 진료실 입구 모니터에 적합하며 레이아웃과 컬러를 설정할 수 있습니다.",
    accent: "#059669",
  },
  {
    key: "pharmacy",
    icon: "💊",
    title: "약국 전광판",
    subtitle: "원내약국 · 약 수령 대기",
    desc: "조제가 완료된 투약번호를 호출합니다. 현재 호출 번호를 크게 보여주고, 수령 대기 중인 번호 목록을 함께 표시합니다.",
    accent: "#0D9488",
  },
  {
    key: "er",
    icon: "🚑",
    title: "응급실 혼잡도 전광판",
    subtitle: "응급의료센터 · 상황실",
    desc: "병상 가동률과 중증도(KTAS), 검사 진행 현황을 도넛 차트로 요약하고, 현재 재실 환자 목록을 함께 보여줍니다.",
    accent: "#DC2626",
  },
  {
    key: "radiology",
    icon: "🩻",
    title: "영상의학과 호출 전광판",
    subtitle: "X-ray · CT · MRI · 초음파",
    desc: "검사실별로 현재 호출 중인 환자와 대기 순번을 표시합니다. 개인정보 보호를 위해 이름은 일부만 마스킹해 보여줍니다.",
    accent: "#4338CA",
  },
];

export default function SelectScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [setDefault, setSetDefault] = useState(false);

  const enterBoard = (key) => {
    if (setDefault) localStorage.setItem("hm_default_board", key);
    else localStorage.removeItem("hm_default_board");
    navigate(`/board/${key}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FF", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div
        style={{
          background: "#fff",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            🏥
          </div>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>롯데병원 대기 전광판</div>
            <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{user?.name}님, 표시할 화면을 선택하세요</div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            background: "#fff",
            color: "#6B7280",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 420px))", gap: "20px", justifyContent: "center", width: "100%" }}>
          {BOARDS.map((b) => (
            <button
              key={b.key}
              onClick={() => enterBoard(b.key)}
              style={{
                textAlign: "left",
                background: "#fff",
                border: "2px solid #F3F4F6",
                borderRadius: "24px",
                padding: "30px 28px",
                cursor: "pointer",
                transition: "all 0.18s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = b.accent;
                e.currentTarget.style.boxShadow = `0 12px 32px ${b.accent}22`;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#F3F4F6";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  background: `${b.accent}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  marginBottom: "18px",
                }}
              >
                {b.icon}
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#111827", marginBottom: "4px" }}>{b.title}</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: b.accent, marginBottom: "12px" }}>{b.subtitle}</div>
              <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.7, wordBreak: "keep-all" }}>{b.desc}</div>
              <div style={{ marginTop: "18px", fontSize: "0.82rem", fontWeight: 800, color: b.accent }}>화면 열기 →</div>
            </button>
          ))}
        </div>

        <label
          style={{
            marginTop: "28px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            color: "#6B7280",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input type="checkbox" checked={setDefault} onChange={(e) => setSetDefault(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
          선택한 화면을 이 기기의 기본 화면으로 설정 (다음 접속 시 자동 진입)
        </label>
      </div>
    </div>
  );
}
