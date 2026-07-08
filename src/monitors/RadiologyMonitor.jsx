import { useEffect, useRef, useState } from "react";
import Clock from "../components/Clock";
import BoardNav from "../components/BoardNav";
import NoticeMarquee from "../components/NoticeMarquee";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { usePaging } from "../hooks/usePaging";
import { fetchRadiologyStatus, nextRadiologyPatient } from "../api/dataService";
import { maskName } from "../utils/maskName";

const ACCENT = "#4338CA";
const DEFAULT_CALL_INTERVAL_MS = 12000;
// 전광판은 스크롤이 안 되므로 대기열 자체는 넉넉히 쌓아두고, 화면에는 usePaging으로 나눠 보여준다.
const MAX_QUEUE_PER_ROOM = 24;
const WAITING_PAGE_MS = 5000;

function formatElapsed(calledAt, now) {
  const sec = Math.max(0, Math.floor((now - calledAt) / 1000));
  if (sec < 60) return `${sec}초 전`;
  return `${Math.floor(sec / 60)}분 전`;
}

function formatWaitTime(sinceAt, now) {
  const sec = Math.max(0, Math.floor((now - sinceAt) / 1000));
  if (sec < 60) return `${sec}초째 대기`;
  return `${Math.floor(sec / 60)}분째 대기`;
}

// 그리드가 몇 줄로 접히는지에 따라 카드 실제 높이가 크게 달라지므로,
// 방 개수(=줄 수)에 맞춰 페이지당 보여줄 대기자 수도 함께 조정한다.
// 1개(전체화면)·2~3개(한 줄, 카드가 세로로 길다)·4개 이상(두 줄, 카드가 절반 높이)
function waitingPerPage(roomCount) {
  if (roomCount <= 1) return 8;
  if (roomCount <= 3) return 6;
  return 3;
}

// 로고 클릭 시 뜨는 설정 모달. 파트(X-ray/CT/MRI/초음파)를 고르고,
// 그 파트 안에서 이 전광판에 실제로 표시할 방 개수(방)까지 체크박스로 고를 수 있다.
function ModalitySelectModal({ modalities, selectedId, selectedRoomIds, onApply, onClose }) {
  const [localModalityId, setLocalModalityId] = useState(selectedId);
  const [localRoomIds, setLocalRoomIds] = useState(new Set(selectedRoomIds));

  const localModality = modalities.find((m) => m.id === localModalityId) || modalities[0];

  const switchModality = (id) => {
    setLocalModalityId(id);
    // 파트를 바꾸면 그 파트의 방 전체를 기본 선택 상태로 보여준다.
    const m = modalities.find((mm) => mm.id === id);
    setLocalRoomIds(new Set(m.rooms.map((r) => r.id)));
  };

  const toggleRoom = (roomId) => {
    setLocalRoomIds((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        if (next.size > 1) next.delete(roomId); // 최소 1개 방은 남긴다
      } else {
        next.add(roomId);
      }
      return next;
    });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.18s ease-out" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "24px", width: "560px", maxWidth: "92vw", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", animation: "slideUp 0.22s ease-out", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #F3F4F6", background: "linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 100%)", flexShrink: 0 }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>전광판 설정</div>
          <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "3px" }}>검사 파트를 고르고, 이 화면에 표시할 방을 선택하세요.</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          {/* STEP 1: 파트 선택 */}
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.12em", marginBottom: "10px" }}>STEP 1 · 검사 파트</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "22px" }}>
            {modalities.map((m) => {
              const active = m.id === localModalityId;
              return (
                <button
                  key={m.id}
                  onClick={() => switchModality(m.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: active ? `2px solid ${m.accent}` : "2px solid #F3F4F6",
                    background: active ? `${m.accent}0A` : "#FAFAFA",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: active ? `${m.accent}18` : "#EFEFEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.05rem", flexShrink: 0 }}>{m.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: active ? "#111827" : "#374151" }}>{m.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{m.rooms.length}개 방</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* STEP 2: 방 선택 */}
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.12em", marginBottom: "10px" }}>
            STEP 2 · 표시할 방 <span style={{ color: localModality.accent, fontWeight: 800 }}>({localRoomIds.size}/{localModality.rooms.length})</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {localModality.rooms.map((r) => {
              const checked = localRoomIds.has(r.id);
              return (
                <div
                  key={r.id}
                  onClick={() => toggleRoom(r.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "11px 14px",
                    borderRadius: "12px",
                    border: checked ? `2px solid ${localModality.accent}` : "2px solid #F3F4F6",
                    background: checked ? `${localModality.accent}0A` : "#FAFAFA",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      flexShrink: 0,
                      background: checked ? localModality.accent : "#FFFFFF",
                      border: checked ? `2px solid ${localModality.accent}` : "2px solid #D1D5DB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {checked && <span style={{ color: "#FFFFFF", fontSize: "0.65rem", fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: checked ? "#111827" : "#6B7280" }}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "14px 20px 20px", borderTop: "1px solid #F3F4F6", display: "flex", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            취소
          </button>
          <button
            onClick={() => {
              onApply(localModalityId, [...localRoomIds]);
              onClose();
            }}
            style={{ flex: 1.4, padding: "12px", borderRadius: "12px", border: "none", background: localModality.accent, color: "#fff", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, modalityName, modalityIcon, accent, queue, now, spacious, roomCount }) {
  const current = queue[0];
  const allWaiting = queue.slice(1);
  const perPage = waitingPerPage(roomCount);
  const { pageItems: waitingPage, page: waitPage, totalPages: waitTotalPages } = usePaging(allWaiting, perPage, WAITING_PAGE_MS);

  return (
    <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* 방 헤더 — 검사 종류(모달리티)를 맨 왼쪽에 꽉 채운 블록으로 강조하고, 구분선 뒤에 방 번호를 붙인다 */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", rowGap: "8px", columnGap: "12px", borderBottom: "1px solid #F3F4F6" }}>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: `0 3px 10px ${accent}45`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 16px",
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)`,
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 900,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{modalityIcon}</span>
            {modalityName}
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.4)" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              background: `${accent}14`,
              color: accent,
              fontSize: "1rem",
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            {room.label}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, whiteSpace: "nowrap" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", animation: "pulse 1.8s ease-in-out infinite", flexShrink: 0 }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>대기 {allWaiting.length}명</span>
        </div>
      </div>

      {/* 현재 호출 */}
      {current ? (
        <div
          key={current.id}
          style={{
            margin: "14px 16px 0",
            borderRadius: "16px",
            padding: spacious ? "32px 28px" : "20px 22px",
            background: `linear-gradient(135deg, ${accent}EE 0%, ${accent}AA 100%)`,
            boxShadow: `0 4px 16px ${accent}40`,
            animation: "fadeUp 0.4s ease-out",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: "0.14em", marginBottom: "8px" }}>지금 호출 중</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: spacious ? "3.4rem" : "2.5rem", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{maskName(current.name)}</span>
            <span style={{ fontSize: spacious ? "1.3rem" : "1.1rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
              {current.age}세 · {current.gender}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
            <span style={{ fontSize: spacious ? "1.15rem" : "1rem", fontWeight: 800, color: "#fff", background: "rgba(255,255,255,0.22)", padding: "5px 14px", borderRadius: "999px" }}>{current.exam}</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{formatElapsed(current.calledAt, now)}</span>
          </div>
        </div>
      ) : (
        <div style={{ margin: "14px 16px 0", borderRadius: "16px", padding: "24px", textAlign: "center", background: "#F8FAFC", color: "#9CA3AF", fontSize: "0.95rem", fontWeight: 600 }}>대기 환자가 없습니다</div>
      )}

      {/* 대기 목록 — 인원이 많으면 스크롤 대신 자동으로 페이지가 넘어간다 */}
      <div key={waitPage} style={{ flex: 1, padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: "8px", animation: "pageIn 0.35s ease-out" }}>
        {allWaiting.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#D1D5DB", fontSize: "0.9rem", fontWeight: 600 }}>다음 대기자가 없습니다</div>
        ) : (
          waitingPage.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", borderRadius: "12px", background: "#FAFAFA" }}>
              <span style={{ width: "34px", fontSize: "1.5rem", fontWeight: 800, color: "#9CA3AF" }}>{waitPage * perPage + i + 1}</span>
              <span style={{ fontSize: "1.7rem", fontWeight: 800, color: "#1F2937" }}>{maskName(p.name)}</span>
              <span style={{ fontSize: "1.3rem", fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap" }}>
                {p.age}세 · {p.gender}
              </span>
              <span style={{ flex: 1, minWidth: 0 }} />
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: accent,
                  background: `${accent}14`,
                  padding: "6px 16px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "220px",
                }}
              >
                {p.exam}
              </span>
              <span style={{ fontSize: "1.15rem", fontWeight: 600, color: "#9CA3AF", whiteSpace: "nowrap" }}>{formatWaitTime(p.calledAt, now)}</span>
            </div>
          ))
        )}
      </div>

      {waitTotalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", padding: "0 16px 12px", flexShrink: 0 }}>
          {Array.from({ length: waitTotalPages }).map((_, i) => (
            <div key={i} style={{ width: i === waitPage ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === waitPage ? accent : "#E5E7EB", transition: "all 0.3s" }} />
          ))}
        </div>
      )}
    </div>
  );
}

// 방 개수에 따라 그리드 컬럼을 유동적으로 정한다: 1개는 꽉 채워서 크게,
// 2개는 좌우, 3개는 한 줄, 4개 이상은 2열로 접는다.
function gridForRoomCount(n) {
  if (n <= 1) return { gridTemplateColumns: "1fr", gridTemplateRows: "1fr" };
  if (n === 2) return { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr" };
  if (n === 3) return { gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr" };
  return { gridTemplateColumns: "1fr 1fr", gridTemplateRows: `repeat(${Math.ceil(n / 2)}, 1fr)` };
}

export default function RadiologyMonitor() {
  const [modalities, setModalities] = useState(null);
  const [queues, setQueues] = useState(null);
  const [notices, setNotices] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [modalityId, setModalityId] = useLocalStorage("hm_radiology_modality", null);
  // 파트별로 이 기기에서 실제로 보여줄 방 id 목록. 값이 없으면(=아직 고른 적 없으면) 전체 방을 보여준다.
  const [roomSelection, setRoomSelection] = useLocalStorage("hm_radiology_rooms", {});
  const queuesRef = useRef(null);

  useEffect(() => {
    fetchRadiologyStatus().then((res) => {
      setModalities(res.modalities);
      setQueues(res.queues);
      queuesRef.current = res.queues;
      setNotices(res.notices);
      // 아직 파트를 고른 적 없는 기기라면 첫 파트를 기본값으로 보여준다.
      if (!modalityId && res.modalities.length > 0) setModalityId(res.modalities[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const modality = modalities?.find((m) => m.id === modalityId) || null;

  // 선택된 파트의 방들만 서로 다른 주기로 다음 환자를 호출하는 상황을 흉내낸다.
  // 파트가 바뀌면 이전 방들의 타이머는 정리하고 새 방 목록으로 다시 구독한다.
  useEffect(() => {
    if (!modality) return;
    const timers = modality.rooms.map((room, i) =>
      setInterval(() => {
        setQueues((prev) => {
          const cur = queuesRef.current || prev;
          const nextQueue = [...(cur[room.id] || []).slice(1), nextRadiologyPatient(room.id)].slice(-MAX_QUEUE_PER_ROOM);
          const updated = { ...cur, [room.id]: nextQueue };
          queuesRef.current = updated;
          return updated;
        });
      }, DEFAULT_CALL_INTERVAL_MS + i * 2500)
    );
    return () => timers.forEach(clearInterval);
  }, [modality]);

  if (!modalities || !queues || !modality) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "0.9rem" }}>
        검사실 호출 현황을 불러오는 중…
      </div>
    );
  }

  const displayedRoomIds = roomSelection[modality.id] || modality.rooms.map((r) => r.id);
  const displayedRooms = modality.rooms.filter((r) => displayedRoomIds.includes(r.id));
  const roomCount = displayedRooms.length;
  const spacious = roomCount === 1;

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#F1F5F9", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ position: "relative", background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 0 #F3F4F6, 0 2px 8px rgba(0,0,0,0.04)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            onClick={() => setShowModal(true)}
            title="클릭하여 검사 파트 선택"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${modality.accent} 0%, #1E1B4B 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              boxShadow: `0 2px 8px ${modality.accent}40`,
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {modality.icon}
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>롯데병원</div>
            <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "3px", letterSpacing: "0.05em" }}>
              <span style={{ color: modality.accent, fontWeight: 700 }}>영상의학과 · {modality.name}</span> · 검사 호출 현황판 ({roomCount}개 방)
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>영상의학과 호출 전광판</div>
          <div style={{ width: "40px", height: "3px", borderRadius: "2px", background: modality.accent, margin: "6px auto 0" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <BoardNav />
          <Clock />
        </div>
      </div>

      {/* 본문: 방 개수에 맞춰 유동적으로 배치 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", padding: "16px", minHeight: 0 }}>
        <div style={{ flex: 1, display: "grid", gap: "14px", minHeight: 0, ...gridForRoomCount(roomCount) }}>
          {displayedRooms.map((room) => (
            <RoomCard key={room.id} room={room} modalityName={modality.name} modalityIcon={modality.icon} accent={modality.accent} queue={queues[room.id] || []} now={now} spacious={spacious} roomCount={roomCount} />
          ))}
        </div>

        <NoticeMarquee notices={notices} bg="linear-gradient(90deg,#312E81,#1E1B4B)" labelColor="#A5B4FC" textColor="#E0E7FF" borderColor="rgba(165,180,252,0.3)" />
      </div>

      {showModal && (
        <ModalitySelectModal
          modalities={modalities}
          selectedId={modalityId}
          selectedRoomIds={displayedRoomIds}
          onApply={(id, roomIds) => {
            setModalityId(id);
            setRoomSelection((prev) => ({ ...prev, [id]: roomIds }));
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
