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
// TV 화면에서 눈에 띄지 않도록 작게 유지한다.
export default function BoardNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
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
