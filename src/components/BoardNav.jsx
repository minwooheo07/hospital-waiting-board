import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const btnStyle = {
  padding: "7px 13px",
  borderRadius: "9px",
  border: "1px solid #E5E7EB",
  background: "#FFFFFF",
  color: "#6B7280",
  fontSize: "0.72rem",
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// 전광판 상단에 붙는 화면 전환/로그아웃 버튼.
// TV 화면에서는 평소 숨겨두고 마우스를 올렸을 때만 보이게 한다.
export default function BoardNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <button
        style={btnStyle}
        onClick={() => {
          localStorage.removeItem("hm_default_board");
          navigate("/select");
        }}
      >
        화면 선택
      </button>
      <button
        style={btnStyle}
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
