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
