import { UserRole } from './enums';

export const USERS = {
    employee: {
        id: 'LP125',
        username: 'qwer',
        name: '이채연',
        role: UserRole.EMPLOYEE,
        jobTitle: 'Product Owner',
        avatarUrl: 'https://picsum.photos/id/64/200/200',
        status: '재직중',
        tags: ['플랫폼팀', '재직중']
    },
    admin: {
        id: 'HR001',
        username: 'admin',
        name: '김유연',
        role: UserRole.ADMIN,
        jobTitle: 'Senior HR Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        status: '재직중',
        tags: ['인사팀', '재직중']
    },
    creator: {
        id: '5',
        username: 'gamedol',
        name: '겜돌이',
        role: UserRole.CREATOR,
        jobTitle: 'Creator',
        avatarUrl: 'https://picsum.photos/id/4/200/200',
        status: '재직중',
        tags: ['크리에이터', '계약중']
    }
};

export const INITIAL_SCHEDULE_TEMPLATES = [
    { id: 'company', name: '회사 일정', color: 'blue' },
    { id: 'personal', name: '개인 일정', color: 'green' },
];

export const INITIAL_SCHEDULE_EVENTS = [
    { id: 1, templateId: 'company', title: '신년 전체 회의', content: '2026년 목표 설정', date: '2026-01-05', ownerId: 'HR001' },
    { id: 2, templateId: 'personal', title: '건강검진', content: '오전 9시', date: '2026-01-12', ownerId: 'LP125' },
    { id: 3, templateId: 'company', title: '설날 선물 배포', content: '로비 1층', date: '2026-01-28', ownerId: 'HR001' },
    { id: 4, templateId: 'personal', title: '관리자 전용 일정', content: '이건 직원에게 보이면 안됨', date: '2026-01-15', ownerId: 'HR001' },
];

export const EMPLOYEE_PROFILE_DATA = {
    name: '이채연',
    engName: 'Sophia Lee',
    nickname: '소피아',
    email: 'sophia@company.com',
    personalEmail: 'sophia@gmail.com',
    phone: '010-9876-5432',
    employeeId: 'LP125',
    joinDate: '2022년 01월 10일',
    tenure: '2년 1개월 재직',
    groupJoinDate: '2022년 01월 10일',
    org: '기술본부 (Tech Div)',
    job: 'Product Owner',
    rank: '매니저 / Level 3',
    avatarUrl: 'https://picsum.photos/id/64/400/400',
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
};

export const ADMIN_PROFILE_DATA = {
    name: '김유연',
    engName: 'Jenny Kim',
    nickname: '제니',
    email: 'jenny@company.com',
    personalEmail: 'jenny@naver.com',
    phone: '010-1234-5678',
    employeeId: 'HR001',
    joinDate: '2019년 03월 15일',
    tenure: '5년 재직',
    groupJoinDate: '2019년 03월 15일',
    org: '인사문화팀 (HR Team)',
    job: 'Senior HR Manager',
    rank: '팀장 / Level 5',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
};

export const INITIAL_VACATION_LOGS = [
    { id: 101, name: '손흥민', type: '연차', startDate: '2026-02-14', endDate: '2026-02-15', days: 2, status: '대기중', reason: '개인 사정으로 인한 휴가' },
    { id: 102, name: '김민재', type: '워케이션', startDate: '2026-02-20', endDate: '2026-02-24', days: 5, status: '대기중', reason: '제주도 워케이션', location: '제주 오피스', emergencyContact: '010-1111-2222', workGoals: '백엔드 마이그레이션 기획' },
    { id: 103, name: '박지성', type: '반차', startDate: '2026-02-10', endDate: '2026-02-10', days: 0.5, status: '대기중', reason: '오후 병원 진료' },
    { id: 201, name: '이채연', type: '연차', startDate: '2026-01-20', endDate: '2026-01-22', days: 3, status: '승인됨', reason: '겨울 가족 여행' },
    { id: 203, name: '박지성', type: '병가', startDate: '2026-01-05', endDate: '2026-01-07', days: 3, status: '승인됨', reason: '독감', symptoms: '고열 및 근육통', hospital: '서울대병원' },
    { id: 301, name: '이강인', type: '워케이션', startDate: '2026-01-08', endDate: '2026-01-12', days: 5, status: '반려됨', reason: '강릉 워케이션', rejectionReason: '해당 기간 팀 내 주요 프로젝트 런칭 일정과 겹쳐 부재가 불가능합니다.' },
    { id: 401, name: '김유연', type: '연차', startDate: '2025-12-20', endDate: '2025-12-22', days: 3, status: '사용완료', reason: '크리스마스 휴가' },
];

export const INITIAL_EMPLOYEES = [
    { id: 'HR001', name: '김유연', engName: 'Jenny Kim', dept: '인사문화팀 (HR Team)', role: 'Senior Manager', workStatus: '출근', email: 'jenny@company.com', phone: '010-1234-5678', joinDate: '2019-03-15', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', nickname: '제니', rank: '팀장 / Level 5', remainingVacation: 15 },
    { id: 'LP125', name: '이채연', engName: 'Sophia Lee', dept: '기술본부 (Tech Div)', role: 'Product Owner', workStatus: '출근', email: 'sophia@company.com', phone: '010-9876-5432', joinDate: '2022-01-10', avatarUrl: 'https://picsum.photos/id/64/200/200', nickname: '소피아', rank: '매니저 / Level 3', remainingVacation: 12.5 },
    { id: 'DV022', name: '박지성', engName: 'Jisung Park', dept: '기술본부 (Tech Div)', role: 'Frontend Dev', workStatus: '휴가', email: 'park@company.com', phone: '010-1111-2222', joinDate: '2021-05-20', avatarUrl: 'https://picsum.photos/id/10/200/200', nickname: '지성', rank: '시니어 / Level 4', remainingVacation: 10 },
    { id: 'DV023', name: '손흥민', engName: 'Sonny', dept: '기술본부 (Tech Div)', role: 'Backend Dev', workStatus: '퇴근', email: 'son@company.com', phone: '010-3333-4444', joinDate: '2021-06-01', avatarUrl: 'https://picsum.photos/id/55/200/200', nickname: '쏘니', rank: '시니어 / Level 4', remainingVacation: 8 },
    { id: 'MK005', name: '이강인', engName: 'Kangin Lee', dept: '마케팅팀 (Marketing)', role: 'Marketer', workStatus: '병가', email: 'lee@company.com', phone: '010-5555-6666', joinDate: '2023-01-01', avatarUrl: 'https://picsum.photos/id/33/200/200', nickname: '강인', rank: '주니어 / Level 2', remainingVacation: 14 },
    { id: 'DV024', name: '김민재', engName: 'Minjae Kim', dept: '매니지먼트 (Creator Mgmt)', role: 'Manager', workStatus: '출근', email: 'kim@company.com', phone: '010-7777-8888', joinDate: '2022-08-15', avatarUrl: 'https://picsum.photos/id/100/200/200', nickname: '몬스터', rank: '매니저 / Level 3', remainingVacation: 11 },
];

export const INITIAL_TEAMS = [
    { id: 't1', name: 'Platform Squad', description: '핵심 서비스 플랫폼 개발 및 운영', leaderId: 'LP125', memberIds: ['LP125', 'DV022', 'DV023'] },
    { id: 't2', name: 'People & Culture', description: '인사, 조직문화, 채용 관리', leaderId: 'HR001', memberIds: ['HR001'] },
    { id: 't3', name: 'Marketing', description: '브랜드 마케팅 및 퍼포먼스 마케팅', leaderId: '', memberIds: ['MK005'] },
];

export const INITIAL_DEPARTMENTS = [
    { id: 'Executive', name: '경영지원본부 (Executive)', phone: '02-555-0001', description: '회사 경영 전반 및 전략 수립', color: 'bg-slate-800' },
    { id: 'Business Div', name: '사업본부 (Business Div)', phone: '02-555-1000', description: '신규 사업 개발 및 제휴', color: 'bg-blue-600' },
    { id: 'Creator Mgmt', name: '매니지먼트 (Creator Mgmt)', phone: '02-555-2000', description: '크리에이터 케어 및 일정 관리', color: 'bg-emerald-500' },
    { id: 'Production', name: '제작본부 (Production)', phone: '02-555-3000', description: '오리지널 콘텐츠 기획 및 제작', color: 'bg-purple-500' },
    { id: 'Marketing', name: '마케팅팀 (Marketing)', phone: '02-555-4000', description: '브랜드 마케팅 및 홍보', color: 'bg-orange-500' },
    { id: 'Tech', name: '기술본부 (Tech Div)', phone: '02-555-5000', description: '플랫폼 개발 및 인프라 운영', color: 'bg-indigo-600' },
    { id: 'HR', name: '인사문화팀 (HR Team)', phone: '02-555-6000', description: '채용, 평가, 보상 및 조직문화', color: 'bg-rose-500' },
    { id: 'Global', name: '글로벌사업팀 (Global Biz)', phone: '02-555-7000', description: '해외 크리에이터 발굴 및 사업 확장', color: 'bg-cyan-600' },
];

export const INITIAL_HEALTH_RECORDS = [
    { id: 1, name: '김유연', lastCheck: '2025-10-15', hospital: 'KMI 여의도', result: '정상 (양호)', nextCheck: '2026-10-15' },
    { id: 2, name: '이채연', lastCheck: '2025-11-20', hospital: '강북삼성병원', result: '정상 (경미)', nextCheck: '2026-11-20' },
    { id: 3, name: '박지성', lastCheck: '2025-09-10', hospital: '서울대병원', result: '유소견 (주의)', nextCheck: '2026-03-10' },
    { id: 4, name: '손흥민', lastCheck: '2025-12-05', hospital: '하나로의료재단', result: '정상 (양호)', nextCheck: '2026-12-05' },
    { id: 5, name: '이강인', lastCheck: '2026-01-15', hospital: '세브란스병원', result: '정상 (양호)', nextCheck: '2027-01-15' },
    { id: 6, name: '김민재', lastCheck: '2025-08-22', hospital: '서울성모병원', result: '유소견 (주의)', nextCheck: '2026-02-22' },
    { id: 7, name: '황희찬', lastCheck: '2025-07-01', hospital: 'KMI 광화문', result: '정상 (양호)', nextCheck: '2026-07-01' },
    { id: 8, name: '조규성', lastCheck: '2025-06-12', hospital: '강남내과', result: '유소견 (위험)', nextCheck: '2025-12-12' },
    { id: 9, name: '정우영', lastCheck: '2025-05-20', hospital: '부산대병원', result: '정상 (양호)', nextCheck: '2026-05-20' },
    { id: 10, name: '백승호', lastCheck: '2025-04-10', hospital: '한림대성심병원', result: '재검 필요', nextCheck: '2025-05-10' },
    { id: 11, name: '이재성', lastCheck: '2025-03-05', hospital: '서울대병원', result: '정상 (양호)', nextCheck: '2026-03-05' },
    { id: 12, name: '김승규', lastCheck: '2025-02-18', hospital: '강북삼성병원', result: '정상 (경미)', nextCheck: '2026-02-18' },
    { id: 13, name: '권창훈', lastCheck: '2024-12-10', hospital: 'KMI 여의도', result: '유소견 (주의)', nextCheck: '2025-06-10' },
    { id: 14, name: '나상호', lastCheck: '2025-01-05', hospital: '세브란스병원', result: '정상 (양호)', nextCheck: '2026-01-05' },
    { id: 15, name: '김진수', lastCheck: '2024-11-12', hospital: '서울아산병원', result: '유소견 (위험)', nextCheck: '2025-02-12' },
    { id: 16, name: '김문환', lastCheck: '2025-08-05', hospital: '강남세브란스', result: '정상 (양호)', nextCheck: '2026-08-05' },
    { id: 17, name: '김영권', lastCheck: '2025-07-20', hospital: '서울성모병원', result: '정상 (양호)', nextCheck: '2026-07-20' },
    { id: 18, name: '조현우', lastCheck: '2025-09-30', hospital: '하나로의료재단', result: '재검 필요', nextCheck: '2025-10-30' },
];
