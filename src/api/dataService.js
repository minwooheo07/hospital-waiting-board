// 데이터 접근 계층.
// 현재는 mock 데이터를 비동기로 반환하며, 실제 백엔드 연동 시
// 이 파일의 함수 내부만 fetch/axios 호출로 교체하면 화면 코드는 수정할 필요가 없다.
import { USERS, DEPARTMENTS, NOTICES, HOSPITAL_INFO } from "../data/mockData";

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
