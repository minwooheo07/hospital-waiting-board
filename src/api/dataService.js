// 데이터 접근 계층.
// 현재는 mock 데이터를 비동기로 반환하며, 실제 백엔드 연동 시
// 이 파일의 함수 내부만 fetch/axios 호출로 교체하면 화면 코드는 수정할 필요가 없다.
import { USERS, DEPARTMENTS, NOTICES, HOSPITAL_INFO, PHARMACY_QUEUE_SEED } from "../data/mockData";

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
