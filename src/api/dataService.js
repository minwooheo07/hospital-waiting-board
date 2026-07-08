// 데이터 접근 계층.
// 현재는 mock 데이터를 비동기로 반환하며, 실제 백엔드 연동 시
// 이 파일의 함수 내부만 fetch/axios 호출로 교체하면 화면 코드는 수정할 필요가 없다.
import {
  USERS,
  DEPARTMENTS,
  NOTICES,
  HOSPITAL_INFO,
  PHARMACY_QUEUE_SEED,
  ER_INFO,
  ER_PATIENTS_SEED,
  ER_ZONES,
  ER_RESOURCES,
  ER_TEST_TIMES,
  ER_NOTICES,
  RADIOLOGY_MODALITIES,
  RADIOLOGY_QUEUE_SEED,
  RADIOLOGY_NOTICES,
  OR_INFO,
  OR_PATIENTS_SEED,
  OR_NOTICES,
} from "../data/mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(username, password) {
  await delay(400);
  const user = USERS.find((u) => u.username === username && u.password === password);
  if (!user) throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  return { id: user.id, username: user.username, name: user.name };
}

export async function fetchDepartments() {
  await delay(200);
  return DEPARTMENTS;
}

export async function fetchNotices() {
  await delay(100);
  return NOTICES;
}

export async function fetchHospitalInfo() {
  await delay(50);
  return HOSPITAL_INFO;
}

export async function fetchPharmacyQueue() {
  await delay(150);
  return PHARMACY_QUEUE_SEED.map((item) => ({ ...item }));
}

// 실제 조제 시스템 연동 전까지, 마지막 호출 번호 다음 번호를 임의로 만들어 호출을 흉내낸다.
// 백엔드가 준비되면 이 함수는 실시간 호출 이벤트를 구독하는 코드로 교체된다.
export function nextPharmacyNumber(lastNumber) {
  const n = parseInt(lastNumber, 10) + 1;
  return String(n).padStart(6, "0");
}

export async function fetchERStatus() {
  await delay(200);
  return {
    bedCapacity: ER_INFO.bedCapacity,
    patients: ER_PATIENTS_SEED.map((p) => ({ ...p })),
    zones: ER_ZONES.map((z) => ({ ...z })),
    resources: { ...ER_RESOURCES },
    testTimes: ER_TEST_TIMES.map((t) => ({ ...t })),
    notices: [...ER_NOTICES],
  };
}

// 파트(모달리티) 목록과 방별 대기열을 함께 내려준다. 파트마다 방 개수가 다르므로
// 화면에서는 rooms 배열 길이에 맞춰 레이아웃을 유동적으로 구성한다.
export async function fetchRadiologyStatus() {
  await delay(200);
  const queues = {};
  for (const modality of RADIOLOGY_MODALITIES) {
    for (const room of modality.rooms) {
      queues[room.id] = (RADIOLOGY_QUEUE_SEED[room.id] || []).map((p) => ({ ...p }));
    }
  }
  return {
    modalities: RADIOLOGY_MODALITIES.map((m) => ({ ...m, rooms: m.rooms.map((r) => ({ ...r })) })),
    queues,
    notices: [...RADIOLOGY_NOTICES],
  };
}

const EXAMS_BY_MODALITY = {
  xray: ["흉부 X-ray", "복부 X-ray", "척추 X-ray", "손목 X-ray", "무릎 X-ray"],
  ct: ["복부 CT", "흉부 CT", "뇌 CT", "척추 CT"],
  mri: ["뇌 MRI", "척추 MRI", "무릎 MRI", "어깨 MRI"],
  us: ["복부 초음파", "갑상선 초음파", "심장 초음파", "유방 초음파"],
};
const NAME_POOL = ["김서준", "이지호", "박하은", "최도윤", "정지안", "강민준", "윤서아", "임지후", "한소율", "오은우"];

// 실제 촬영 시스템 연동 전까지, 방별로 새 환자가 무작위로 호출되는 상황을 흉내낸다.
// roomId는 "xray-1"처럼 "{모달리티}-{번호}" 형태이므로 앞부분으로 검사 종류 후보를 고른다.
export function nextRadiologyPatient(roomId) {
  const modalityId = roomId.split("-")[0];
  const exams = EXAMS_BY_MODALITY[modalityId] || EXAMS_BY_MODALITY.xray;
  return {
    id: `${roomId}-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name: NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)],
    age: 10 + Math.floor(Math.random() * 70),
    gender: Math.random() < 0.5 ? "남" : "여",
    exam: exams[Math.floor(Math.random() * exams.length)],
    calledAt: Date.now(),
  };
}

export async function fetchORStatus() {
  await delay(200);
  return {
    roomCapacity: OR_INFO.roomCapacity,
    patients: OR_PATIENTS_SEED.map((p) => ({ ...p })),
    notices: [...OR_NOTICES],
  };
}
