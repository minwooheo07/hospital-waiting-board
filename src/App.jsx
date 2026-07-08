import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import SelectScreen from "./screens/SelectScreen";
import LargeWaitingMonitor from "./monitors/LargeWaitingMonitor";
import SmallWaitingMonitor from "./monitors/SmallWaitingMonitor";
import PharmacyMonitor from "./monitors/PharmacyMonitor";
import EmergencyMonitor from "./monitors/EmergencyMonitor";
import RadiologyMonitor from "./monitors/RadiologyMonitor";

const BOARD_KEYS = ["main", "small", "pharmacy", "er", "radiology"];

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// 첫 진입 시: 로그인 안 했으면 로그인으로, 기본 전광판이 지정된 기기면 바로 그 화면으로
function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const defaultBoard = localStorage.getItem("hm_default_board");
  if (BOARD_KEYS.includes(defaultBoard)) {
    return <Navigate to={`/board/${defaultBoard}`} replace />;
  }
  return <Navigate to="/select" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/select"
        element={
          <RequireAuth>
            <SelectScreen />
          </RequireAuth>
        }
      />
      <Route
        path="/board/main"
        element={
          <RequireAuth>
            <LargeWaitingMonitor />
          </RequireAuth>
        }
      />
      <Route
        path="/board/small"
        element={
          <RequireAuth>
            <SmallWaitingMonitor />
          </RequireAuth>
        }
      />
      <Route
        path="/board/pharmacy"
        element={
          <RequireAuth>
            <PharmacyMonitor />
          </RequireAuth>
        }
      />
      <Route
        path="/board/er"
        element={
          <RequireAuth>
            <EmergencyMonitor />
          </RequireAuth>
        }
      />
      <Route
        path="/board/radiology"
        element={
          <RequireAuth>
            <RadiologyMonitor />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
