import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const inputStyle = {
  width: "100%",
  height: "50px",
  border: "1.5px solid #E8EEF8",
  borderRadius: "12px",
  padding: "0 16px",
  fontSize: "0.95rem",
  color: "#1A2340",
  background: "#FAFBFF",
  outline: "none",
  fontFamily: "inherit",
};

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      navigate("/select", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FF", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "420px", maxWidth: "100%" }}>
        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.2rem",
              boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
              marginBottom: "14px",
            }}
          >
            🏥
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1A2340", letterSpacing: "-0.02em" }}>롯데병원</div>
          <div style={{ fontSize: "0.8rem", color: "#8899BB", marginTop: "4px" }}>외래 진료 대기 전광판 시스템</div>
        </div>

        {/* 카드 */}
        <form
          onSubmit={handleLogin}
          style={{ background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 8px 20px rgba(37,99,235,0.08)" }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1A2340", marginBottom: "24px" }}>로그인</div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#5A6A8A", marginBottom: "6px" }}>아이디</div>
            <input
              style={inputStyle}
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#5A6A8A", marginBottom: "6px" }}>비밀번호</div>
            <input
              style={inputStyle}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: "#E05A6B", fontSize: "0.78rem", marginBottom: "12px", textAlign: "center" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "52px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(90deg, #2563EB, #1D4ED8)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 800,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "8px",
              fontFamily: "inherit",
            }}
          >
            {loading ? "로그인 중…" : "로그인"}
          </button>

          <div style={{ textAlign: "center", color: "#BFC8D6", fontSize: "0.72rem", marginTop: "16px" }}>테스트: admin / 1234</div>
        </form>
      </div>
    </div>
  );
}
