export const INITIAL_CREATORS = [
    {
        id: '1',
        name: '슈카월드',
        platform: 'YouTube',
        status: '활동중',
        subscribers: '300.0만명',
        avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k2A0y_2y0aFhVj7V9VjB0jVjVjVjVjVjVjVjVj=s176-c-k-c0x00ffffff-no-rj',
        coverUrl: 'https://picsum.photos/id/1/1200/300',
        tags: ['경제', '토크', '지식'],
        category: '경제/시사',
        manager: '이채연',
        managementStartDate: '2023-01-01',
        managementEndDate: '2025-12-31',
        channelName: '슈카월드',
        contactInfo: '010-1234-5678',
        contractStatus: 'Signed',
        loginId: 'syuka',
        password: 'password'
    },
    {
        id: '2',
        name: '침착맨',
        platform: 'Twitch',
        status: '활동중',
        subscribers: '250.0만명',
        avatarUrl: 'https://picsum.photos/id/64/200/200',
        coverUrl: 'https://picsum.photos/id/64/1200/300',
        tags: ['토크', '게임'],
        category: '토크/게임',
        manager: '이채연',
        managementStartDate: '2023-03-15',
        managementEndDate: '2024-03-14',
        channelName: '침착맨',
        contactInfo: '010-9876-5432',
        contractStatus: 'Signed',
        loginId: 'chim',
        password: 'password'
    },
    {
        id: '3',
        name: '요리보고',
        platform: 'YouTube',
        status: '대기중',
        subscribers: '85.0만명',
        avatarUrl: 'https://picsum.photos/id/2/200/200',
        coverUrl: 'https://picsum.photos/id/2/1200/300',
        tags: ['요리', '레시피', '일상'],
        category: '요리',
        manager: '김유연',
        managementStartDate: '2024-01-01',
        managementEndDate: '2024-12-31',
        channelName: 'CookWithMe',
        contactInfo: 'cooking@email.com',
        contractStatus: 'Drafting'
    },
    {
        id: '4',
        name: '여행가제이',
        platform: 'Instagram',
        status: '활동중',
        subscribers: '45.0만명',
        avatarUrl: 'https://picsum.photos/id/3/200/200',
        coverUrl: 'https://picsum.photos/id/3/1200/300',
        tags: ['여행', '브이로그'],
        category: '여행',
        manager: '김유연',
        managementStartDate: '2023-06-01',
        managementEndDate: '2025-05-31',
        channelName: 'JayTrip',
        contactInfo: '010-5555-4444',
        contractStatus: 'Signed'
    },
    {
        id: '5',
        name: '겜돌이',
        platform: 'Twitch',
        status: '활동중',
        subscribers: '12.0만명',
        avatarUrl: 'https://picsum.photos/id/4/200/200',
        coverUrl: 'https://picsum.photos/id/4/1200/300',
        tags: ['게임'],
        category: '게임',
        manager: '이채연',
        managementStartDate: '2024-02-01',
        managementEndDate: '2025-02-01',
        channelName: 'GameZone',
        contactInfo: 'game@email.com',
        contractStatus: 'Signed',
        loginId: 'gamedol',
        password: '1234'
    },
    {
        id: '6',
        name: '치즈냥이',
        platform: 'Chzzk',
        status: '활동중',
        subscribers: '5.5만명',
        avatarUrl: 'https://picsum.photos/id/40/200/200',
        coverUrl: 'https://picsum.photos/id/40/1200/300',
        tags: ['게임', '소통'],
        category: '게임',
        manager: '김유연',
        managementStartDate: '2024-01-15',
        managementEndDate: '2024-07-15',
        channelName: 'CheeseCat',
        contactInfo: 'cat@email.com',
        contractStatus: 'None'
    },
    {
        id: '7',
        name: '철수',
        platform: 'YouTube',
        status: '활동중',
        subscribers: '50.0만명',
        avatarUrl: 'https://picsum.photos/id/100/200/200',
        coverUrl: 'https://picsum.photos/id/100/1200/300',
        tags: ['일상', '브이로그'],
        category: '일상',
        manager: '김유연',
        managementStartDate: '2024-01-01',
        managementEndDate: '2024-12-31',
        channelName: 'CheolsuVlog',
        contactInfo: 'cheolsu@email.com',
        contractStatus: 'Signed'
    }
];

export const INITIAL_TASKS = {
    '1': [
        { id: 't1', title: '다음 주 콘텐츠 기획안 피드백', status: '진행중', assignee: '이채연' },
        { id: 't2', title: '유튜브 채널 아트 리뉴얼 시안 확인', status: '진행중', assignee: '이채연' },
        { id: 't3', title: '6월 정산서 발송', status: '진행중', assignee: '이채연' },
        { id: 't4', title: '구독자 이벤트 당첨자 취합', status: '완료됨', assignee: '박지성' },
        { id: 't5', title: '신규 굿즈 샘플 확인', status: '완료됨', assignee: '이채연' },
    ],
    '2': [
        { id: 't6', title: '밀키트 콜라보 미팅', status: '완료됨', assignee: '최현석' },
    ],
    '5': [
        { id: 't7', title: '신작 게임 프로모션 영상 촬영', status: '진행중', assignee: '이채연' },
        { id: 't8', title: '주간 라이브 하이라이트 편집본 검수', status: '진행중', assignee: '이채연' },
        { id: 't9', title: '팬미팅 장소 대관 확인', status: '완료됨', assignee: '김매니저' },
    ]
};

export const INITIAL_EVENTS = [
    { id: 'e1', creatorId: '1', title: '라이브 방송', date: '2026-01-10', type: 'live', content: '저녁 8시 정규 라이브 방송입니다. 주제: 경제 뉴스 정리' },
    { id: 'e2', creatorId: '1', title: '유튜브 업로드', date: '2026-01-12', type: 'content', content: '편집본 업로드 예정. 썸네일 컨펌 필요.' },
    { id: 'e3', creatorId: '3', title: '광고 미팅', date: '2026-01-15', type: 'meeting', content: '주방용품 브랜드 A사 미팅 (강남역 2시)' },
    { id: 'e4', creatorId: '4', title: '출국 (일본)', date: '2026-01-20', type: 'other', content: '3박 4일 도쿄 브이로그 촬영 일정' },
    { id: 'e5', creatorId: '6', title: '정기 방송', date: '2026-01-05', type: 'live', content: '치지직 이적 후 첫 정기 방송' },
    { id: 'e6', creatorId: '1', title: '브랜드 미팅', date: '2026-01-22', type: 'meeting', content: '금융 앱 B사 연간 계약 논의' },
];

export const INITIAL_AD_PROPOSALS = [
    {
        id: 'ad-dummy-1',
        creatorId: '7',
        brandName: '테크월드',
        campaignTitle: '게이밍 마우스 G-100 리뷰',
        budget: '300만원',
        status: 'pending',
        requestDate: '2024-01-25',
        description: '신제품 게이밍 마우스 상세 리뷰 및 게임 플레이 시연 영상 1편.',
        targetDate: '2024-02-05'
    },
    {
        id: 'ad-1',
        creatorId: '1',
        brandName: '삼성전자',
        campaignTitle: '갤럭시 S24 울트라 기능 리뷰 및 시연',
        budget: '2,500만원',
        status: 'pending',
        requestDate: '2024-01-20',
        description: '신제품 출시 기념 메인 기능(AI) 집중 리뷰 영상 제작 요청드립니다. 엠바고 준수 필수.',
        targetDate: '2024-02-10'
    },
    {
        id: 'ad-2',
        creatorId: '1',
        brandName: '미래에셋증권',
        campaignTitle: '2024년 하반기 경제 전망 세미나',
        budget: '1,000만원',
        status: 'accepted',
        requestDate: '2024-01-15',
        description: '오프라인 세미나 연사 초청 및 유튜브 라이브 송출 건입니다.'
    },
    {
        id: 'ad-3',
        creatorId: '2',
        brandName: '넥슨',
        campaignTitle: '신작 게임 찍먹 플레이',
        budget: '1,500만원',
        status: 'pending',
        requestDate: '2024-01-21',
        description: '캐주얼하게 게임을 즐기는 모습을 담은 라이브 방송 2시간 진행 요청.',
        targetDate: '2024-02-01'
    },
    {
        id: 'ad-4',
        creatorId: '4',
        brandName: '대한항공',
        campaignTitle: '취항지 홍보 브이로그 (유럽)',
        budget: '800만원 + 항공권',
        status: 'rejected',
        requestDate: '2024-01-10',
        description: '신규 취항지 홍보를 위한 여행 브이로그 2편 제작.'
    }
];

export const PALETTE = [
    { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-200', dot: 'bg-gray-600' },
    { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-[#00C471]' },
    { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-blue-600' },
    { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-200', dot: 'bg-purple-600' },
];
