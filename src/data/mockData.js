// 임시 mock 데이터. 실제 API 연동 시 이 파일은 제거되고
// src/api/dataService.js 의 함수들이 서버 응답을 반환하게 된다.

export const USERS = [
  { id: "user-1", username: "admin", password: "1234", name: "관리자" },
];

export const DEPARTMENTS = [
  {
    id: "dept-1",
    name: "내과",
    deptEn: "Internal Medicine",
    accentColor: "#2563EB",
    doctors: [
      {
        id: "doc-1",
        name: "김민준",
        title: "과장",
        specialty: "소화기내과 · 위장관",
        room: "진료실 101호",
        phone: "내선 1101",
        status: "진료중",
        avatar: "KM",
        photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        patients: [
          { number: "202500001", name: "홍길동", age: 54, gender: "남", type: "재진", status: "진료중" },
          { number: "202500002", name: "이미래", age: 38, gender: "여", type: "초진", status: "대기" },
          { number: "202500003", name: "박성호", age: 67, gender: "남", type: "재진", status: "대기" },
          { number: "202500004", name: "최연수", age: 29, gender: "여", type: "초진", status: "대기" },
          { number: "202500005", name: "정우진", age: 45, gender: "남", type: "재진", status: "대기" },
          { number: "202500006", name: "강하늘", age: 33, gender: "여", type: "초진", status: "대기" },
          { number: "202500007", name: "조민서", age: 51, gender: "여", type: "재진", status: "대기" },
          { number: "202500008", name: "윤태경", age: 60, gender: "남", type: "초진", status: "대기" },
          { number: "202500009", name: "한지민", age: 42, gender: "여", type: "재진", status: "대기" },
        ],
      },
      {
        id: "doc-2",
        name: "이서연",
        title: "전문의",
        specialty: "호흡기내과",
        room: "진료실 102호",
        phone: "내선 1102",
        status: "대기중",
        avatar: "LS",
        photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        patients: [
          { number: "202500101", name: "강민수", age: 52, gender: "남", type: "초진", status: "대기" },
          { number: "202500102", name: "윤지현", age: 34, gender: "여", type: "재진", status: "대기" },
          { number: "202500103", name: "장태호", age: 61, gender: "남", type: "재진", status: "대기" },
        ],
      },
      {
        id: "doc-7",
        name: "장현우",
        title: "전문의",
        specialty: "호흡기 · 알레르기",
        room: "진료실 105호",
        phone: "내선 1105",
        status: "진료중",
        avatar: "JH",
        photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
        patients: [
          { number: "202500701", name: "오민준", age: 62, gender: "남", type: "재진", status: "진료중" },
          { number: "202500702", name: "권소영", age: 44, gender: "여", type: "초진", status: "대기" },
          { number: "202500703", name: "백지훈", age: 55, gender: "남", type: "재진", status: "대기" },
        ],
      },
    ],
  },
  {
    id: "dept-2",
    name: "소아청소년과",
    deptEn: "Pediatrics",
    accentColor: "#059669",
    doctors: [
      {
        id: "doc-3",
        name: "박지은",
        title: "과장",
        specialty: "소아 성장 · 알레르기",
        room: "진료실 204호",
        phone: "내선 2041",
        status: "진료중",
        avatar: "PJ",
        photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        patients: [
          { number: "202500201", name: "김지우", age: 7, gender: "남", type: "초진", status: "진료중" },
          { number: "202500202", name: "박서진", age: 4, gender: "여", type: "재진", status: "대기" },
          { number: "202500203", name: "윤하준", age: 11, gender: "남", type: "초진", status: "대기" },
          { number: "202500204", name: "최아린", age: 6, gender: "여", type: "재진", status: "대기" },
        ],
      },
      {
        id: "doc-8",
        name: "윤채원",
        title: "과장",
        specialty: "신생아 · 발달",
        room: "진료실 208호",
        phone: "내선 2081",
        status: "대기중",
        avatar: "YC",
        photoUrl: "https://randomuser.me/api/portraits/women/65.jpg",
        patients: [
          { number: "202500801", name: "이준호", age: 3, gender: "남", type: "초진", status: "대기" },
          { number: "202500802", name: "김하율", age: 5, gender: "여", type: "재진", status: "대기" },
        ],
      },
    ],
  },
  {
    id: "dept-3",
    name: "정형외과",
    deptEn: "Orthopedics",
    accentColor: "#DC2626",
    doctors: [
      {
        id: "doc-4",
        name: "최준혁",
        title: "과장",
        specialty: "척추 · 관절",
        room: "진료실 312호",
        phone: "내선 3121",
        status: "진료중",
        avatar: "CJ",
        photoUrl: "https://randomuser.me/api/portraits/men/55.jpg",
        patients: [
          { number: "202500301", name: "임도현", age: 58, gender: "남", type: "재진", status: "진료중" },
          { number: "202500302", name: "한소희", age: 42, gender: "여", type: "초진", status: "대기" },
          { number: "202500303", name: "조재원", age: 71, gender: "남", type: "재진", status: "대기" },
        ],
      },
      {
        id: "doc-5",
        name: "정수빈",
        title: "전문의",
        specialty: "스포츠의학",
        room: "진료실 313호",
        phone: "내선 3131",
        status: "대기중",
        avatar: "JS",
        photoUrl: "https://randomuser.me/api/portraits/women/22.jpg",
        patients: [
          { number: "202500401", name: "오민재", age: 28, gender: "남", type: "초진", status: "대기" },
          { number: "202500402", name: "신예은", age: 35, gender: "여", type: "재진", status: "대기" },
        ],
      },
    ],
  },
  {
    id: "dept-4",
    name: "피부과",
    deptEn: "Dermatology",
    accentColor: "#7C3AED",
    doctors: [
      {
        id: "doc-6",
        name: "최수아",
        title: "전문의",
        specialty: "아토피 · 미용 피부",
        room: "진료실 408호",
        phone: "내선 4081",
        status: "진료중",
        avatar: "CS",
        photoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
        patients: [
          { number: "202500501", name: "류지안", age: 26, gender: "여", type: "초진", status: "진료중" },
          { number: "202500502", name: "문서준", age: 31, gender: "남", type: "재진", status: "대기" },
          { number: "202500503", name: "배나연", age: 19, gender: "여", type: "초진", status: "대기" },
          { number: "202500504", name: "오태양", age: 44, gender: "남", type: "재진", status: "대기" },
          { number: "202500505", name: "전혜림", age: 28, gender: "여", type: "초진", status: "대기" },
          { number: "202500506", name: "황민석", age: 37, gender: "남", type: "재진", status: "대기" },
          { number: "202500507", name: "남지수", age: 22, gender: "여", type: "초진", status: "대기" },
        ],
      },
    ],
  },
];

export const NOTICES = [
  { icon: "📢", tag: "공지", text: "접수 후 번호표를 지참하시고, 안내방송에 따라 진료실 앞에서 대기해 주세요." },
  { icon: "🏥", tag: "안내", text: "주차는 지하 1·2층을 이용해 주세요. 3시간 무료 주차 가능합니다." },
  { icon: "📋", tag: "안내", text: "진료 예약 변경 및 취소는 원무과(☎ 1688-0000)로 문의하시기 바랍니다." },
  { icon: "💉", tag: "건강정보", text: "독감 예방접종 시즌입니다. 원무과(☎ 1688-0000)로 문의해 주세요." },
  { icon: "🩺", tag: "건강정보", text: "혈압은 매일 같은 시간, 같은 팔로 측정하는 것이 정확합니다." },
  { icon: "🌿", tag: "건강정보", text: "하루 30분 걷기 운동이 심혈관 건강에 큰 도움이 됩니다." },
  { icon: "📋", tag: "안내", text: "원외처방전은 당일에만 유효합니다. 당일 약국에서 수령하시기 바랍니다." },
];

export const HOSPITAL_INFO = {
  name: "롯데병원",
  nameEn: "SEOUL CENTRAL HOSPITAL",
  phone: "1688-0000",
  hours: [
    { day: "평일", time: "09:00 – 18:00", closed: false },
    { day: "토요일", time: "09:00 – 13:00", closed: false },
    { day: "일·공휴일", time: "휴진", closed: true },
  ],
};

// 원내약국 투약번호 호출 현황 초기값. 실제로는 조제 시스템이 번호를 호출할 때마다
// 이 목록 맨 앞에 새 항목이 쌓이는 형태로 동작한다 (dataService.callNextPharmacyNumber 참고).
export const PHARMACY_QUEUE_SEED = [
  { number: "284193", calledAt: Date.now() - 1000 * 30 },
  { number: "284192", calledAt: Date.now() - 1000 * 95 },
  { number: "284191", calledAt: Date.now() - 1000 * 160 },
  { number: "284190", calledAt: Date.now() - 1000 * 230 },
  { number: "284189", calledAt: Date.now() - 1000 * 300 },
  { number: "284188", calledAt: Date.now() - 1000 * 370 },
];

// 응급실 병상 현황. KTAS(중증도 분류) 1~5등급 표준 색상을 사용한다.
// 1: 소생 · 2: 긴급 · 3: 응급 · 4: 준응급 · 5: 비응급
export const KTAS_LEVELS = {
  1: { label: "소생", color: "#E11D48" },
  2: { label: "긴급", color: "#F97316" },
  3: { label: "응급", color: "#F59E0B" },
  4: { label: "준응급", color: "#10B981" },
  5: { label: "비응급", color: "#3B82F6" },
};

// KTAS 등급별 예상 대기 시간 안내.
// 1~2등급은 대기 없이 중증 우선 진료, 3등급은 약 40분, 4~5등급은 구간으로 안내한다.
export const KTAS_WAIT = {
  1: { text: "중증 우선 진료", immediate: true },
  2: { text: "중증 우선 진료", immediate: true },
  3: { text: "약 40분", immediate: false },
  4: { text: "1 ~ 2시간", immediate: false },
  5: { text: "2시간 이상", immediate: false },
};

export const ER_INFO = {
  bedCapacity: 24,
};

// 구역별 병상 가용 현황 (사용/전체). 혼잡의 원인을 파악하는 핵심 지표.
export const ER_ZONES = [
  { name: "응급처치실", used: 6, total: 8, color: "#F43F5E" },
  { name: "관찰실", used: 9, total: 10, color: "#F59E0B" },
  { name: "소아 구역", used: 2, total: 4, color: "#10B981" },
  { name: "격리실", used: 3, total: 3, color: "#6366F1" },
];

// 병상 부족으로 응급실에 머무는 입원 대기(보딩) 환자 수 및 중환자실·수술실 가용 상태.
// 상태 값: "가능" | "제한" | "불가"
export const ER_RESOURCES = {
  boarding: 5,
  icu: "제한",
  or: "가능",
};

// 최근 1~2시간 기준 검사 평균 소요시간(분).
export const ER_TEST_TIMES = [
  { name: "혈액검사", min: 46, icon: "🩸" },
  { name: "CT", min: 32, icon: "🖥️" },
  { name: "X-ray", min: 14, icon: "🦴" },
];

// 응급실 하단 마퀴 공지.
export const ER_NOTICES = [
  "응급도(KTAS)에 따라 진료 순서가 결정되므로, 나중에 오신 분이 먼저 진료받을 수 있습니다.",
  "중증 응급환자 발생 시 진료가 지연될 수 있으니 양해 부탁드립니다.",
  "보호자는 1인만 동반 가능하며, 감염 예방을 위해 마스크를 착용해 주세요.",
  "응급실 진료비 및 대기 관련 문의는 원무과(☎ 1688-0000)로 연락 주세요.",
];

// 실제로는 EMR/베드사이드 모니터링 시스템에서 실시간으로 갱신되는 값이다.
export const ER_PATIENTS_SEED = [
  { id: "er-1", bed: "R-01", number: "202500231", name: "김도현", age: 62, gender: "남", ktas: 1, complaint: "흉통 · 호흡곤란", arrivalMin: 12, imaging: "진행중", lab: "완료", status: "진료중" },
  { id: "er-2", bed: "A-03", number: "202500232", name: "이수민", age: 34, gender: "여", ktas: 2, complaint: "복통 · 구토", arrivalMin: 25, imaging: "완료", lab: "진행중", status: "진료중" },
  { id: "er-3", bed: "A-05", number: "202500233", name: "박준서", age: 8, gender: "남", ktas: 3, complaint: "발열 · 경련 의심", arrivalMin: 18, imaging: "해당없음", lab: "대기", status: "대기" },
  { id: "er-4", bed: "B-02", number: "202500234", name: "최영자", age: 78, gender: "여", ktas: 2, complaint: "낙상 · 고관절 통증", arrivalMin: 40, imaging: "완료", lab: "완료", status: "입원대기" },
  { id: "er-5", bed: "C-07", number: "202500235", name: "정민재", age: 45, gender: "남", ktas: 4, complaint: "손가락 열상", arrivalMin: 33, imaging: "해당없음", lab: "해당없음", status: "진료중" },
  { id: "er-6", bed: "A-08", number: "202500236", name: "한지우", age: 29, gender: "여", ktas: 3, complaint: "알레르기 반응", arrivalMin: 9, imaging: "해당없음", lab: "진행중", status: "대기" },
  { id: "er-7", bed: "R-02", number: "202500237", name: "윤성훈", age: 55, gender: "남", ktas: 1, complaint: "의식저하", arrivalMin: 5, imaging: "대기", lab: "진행중", status: "진료중" },
  { id: "er-8", bed: "B-04", number: "202500238", name: "조은서", age: 71, gender: "여", ktas: 3, complaint: "어지러움 · 두통", arrivalMin: 52, imaging: "완료", lab: "완료", status: "퇴실대기" },
  { id: "er-9", bed: "C-01", number: "202500239", name: "장태민", age: 19, gender: "남", ktas: 4, complaint: "발목 염좌", arrivalMin: 21, imaging: "대기", lab: "해당없음", status: "대기" },
  { id: "er-10", bed: "A-06", number: "202500240", name: "서다인", age: 3, gender: "여", ktas: 3, complaint: "고열 · 탈수 의심", arrivalMin: 15, imaging: "해당없음", lab: "진행중", status: "진료중" },
];
