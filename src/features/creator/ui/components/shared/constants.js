export const INITIAL_CREATORS = [
    {
        id: '2001',
        name: '감스트',
        platform: 'YouTube',
        status: '활동중',
        subscribers: '1250000',
        avatarUrl: 'https://cdn.mcn.com/profiles/gamst.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/gamst_banner.jpg',
        tags: ['게임'],
        category: '게임',
        manager: '박매니저',
        managementStartDate: '2023-01-01',
        managementEndDate: '2026-12-31',
        channelName: '감스트',
        contactInfo: '010-1501-1501',
        contractStatus: 'Signed',
        loginId: 'gamst'
    },
    {
        id: '2002',
        name: '또간집',
        platform: 'YouTube',
        status: '활동중',
        subscribers: '850000',
        avatarUrl: 'https://cdn.mcn.com/profiles/ddoganjip.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/ddoganjip_banner.jpg',
        tags: ['먹방'],
        category: '먹방',
        manager: '박매니저',
        managementStartDate: '2023-06-01',
        managementEndDate: '2026-05-31',
        channelName: '또간집',
        contactInfo: '010-1601-1601',
        contractStatus: 'Signed',
        loginId: 'ddoganjip'
    },
    {
        id: '2003',
        name: '뷰티지니',
        platform: 'YouTube',
        status: '활동중',
        subscribers: '620000',
        avatarUrl: 'https://cdn.mcn.com/profiles/beautyjini.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/beautyjini_banner.jpg',
        tags: ['뷰티'],
        category: '뷰티',
        manager: '최담당',
        managementStartDate: '2024-01-01',
        managementEndDate: '2027-12-31',
        channelName: '뷰티지니',
        contactInfo: 'beauty.jini@gmail.com',
        contractStatus: 'Signed',
        loginId: 'beautyjini'
    },
    {
        id: '2004',
        name: '먹보PD',
        platform: 'Twitch',
        status: '활동중',
        subscribers: '430000',
        avatarUrl: 'https://cdn.mcn.com/profiles/mukbopd.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/mukbopd_banner.jpg',
        tags: ['먹방'],
        category: '먹방',
        manager: '최담당',
        managementStartDate: '2022-09-01',
        managementEndDate: '2025-08-31',
        channelName: '먹보PD',
        contactInfo: '010-1801-1801',
        contractStatus: 'Signed',
        loginId: 'mukbopd'
    },
    {
        id: '2005',
        name: '게임왕민수',
        platform: 'Chzzk',
        status: '활동중',
        subscribers: '980000',
        avatarUrl: 'https://cdn.mcn.com/profiles/gameking.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/gameking_banner.jpg',
        tags: ['게임'],
        category: '게임',
        manager: '정관리',
        managementStartDate: '2023-03-01',
        managementEndDate: '2026-02-28',
        channelName: '게임왕민수',
        contactInfo: 'gamer.minsu@kakao.com',
        contractStatus: 'Signed',
        loginId: 'gamekingminsu'
    },
    {
        id: '2006',
        name: '일상브이로거',
        platform: 'Instagram',
        status: '활동중',
        subscribers: '340000',
        avatarUrl: 'https://cdn.mcn.com/profiles/dailyvlogger.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/dailyvlogger_banner.jpg',
        tags: ['일상'],
        category: '일상',
        manager: '정관리',
        managementStartDate: '2024-07-01',
        managementEndDate: '2027-06-30',
        channelName: '일상브이로거',
        contactInfo: '010-2001-2001',
        contractStatus: 'Signed',
        loginId: 'dailyvlogger'
    },
    {
        id: '2007',
        name: '테크리뷰어',
        platform: 'YouTube',
        status: '활동중',
        subscribers: '560000',
        avatarUrl: 'https://cdn.mcn.com/profiles/techreviewer.jpg',
        coverUrl: 'https://cdn.mcn.com/banners/techreviewer_banner.jpg',
        tags: ['테크'],
        category: '테크',
        manager: '박매니저',
        managementStartDate: '2023-11-01',
        managementEndDate: '2026-10-31',
        channelName: '테크리뷰어',
        contactInfo: 'tech.reviewer@naver.com',
        contractStatus: 'Signed',
        loginId: 'techreviewer'
    }
];

export const INITIAL_TASKS = {
    '2001': [
        { id: 't1', title: '다음 주 콘텐츠 기획안 피드백', status: '진행중', assignee: '박매니저' },
        { id: 't2', title: '유튜브 채널 아트 리뉴얼 시안 확인', status: '진행중', assignee: '문썸네일' },
        { id: 't11', title: '삼성 광고 콘텐츠 1차 편집본 확인', status: '진행중', assignee: '박매니저' },
    ],
    '2002': [
        { id: 't3', title: '2월 먹방 콘텐츠 스케줄 조율', status: '진행중', assignee: '박매니저' },
    ],
    '2003': [
        { id: 't4', title: '뷰티 트렌드 분석 보고서 검토', status: '완료됨', assignee: '최담당' },
        { id: 't5', title: '신규 협찬 제품 수령 및 확인', status: '진행중', assignee: '최담당' },
        { id: 't12', title: '아모레 협찬 콘텐츠 기획안 작성', status: '완료됨', assignee: '최담당' },
    ],
    '2004': [
        { id: 't6', title: '라이브 방송 장비 점검', status: '완료됨', assignee: '정관리' },
    ],
    '2005': [
        { id: 't7', title: '게임 대회 출전 일정 협의', status: '진행중', assignee: '정관리' },
        { id: 't8', title: '신규 게임 협찬 미팅 준비', status: '진행중', assignee: '정관리' },
    ],
    '2006': [
        { id: 't9', title: '브이로그 촬영 장소 섭외', status: '진행중', assignee: '정관리' },
    ],
    '2007': [
        { id: 't10', title: '테크 신제품 발표회 참석 일정 확인', status: '완료됨', assignee: '박매니저' },
    ]
};

export const INITIAL_EVENTS = [
    { id: 'e1', creatorId: '2001', title: '삼성 갤럭시 광고 촬영', date: '2025-02-10', type: 'promotion', content: '삼성전자 본사 방문, 갤럭시 S24 울트라 리뷰 촬영' },
    { id: 'e2', creatorId: '2002', title: '비비고 먹방 촬영', date: '2025-02-20', type: 'content', content: '비비고 왕교자 신제품 먹방 콘텐츠 촬영' },
    { id: 'e3', creatorId: '2003', title: '설화수 체험단 행사', date: '2025-03-05', type: 'promotion', content: '아모레퍼시픽 본사 방문, 설화수 신제품 체험' },
    { id: 'e4', creatorId: '2005', title: '던파 모바일 라이브 방송', date: '2025-02-05', type: 'live', content: '넥슨 던전앤파이터 모바일 신작 라이브 방송 3시간' },
    { id: 'e6', creatorId: '2001', title: '게임왕민수 합방', date: '2025-02-15', type: 'merge', content: '게임왕민수와 함께하는 합방 콘텐츠' },
    { id: 'e7', creatorId: '2005', title: '게임왕민수 합방', date: '2025-02-15', type: 'merge', content: '감스트와 함께하는 합방 콘텐츠' },
    { id: 'e10', creatorId: '2006', title: '일상 브이로그 촬영', date: '2025-01-30', type: 'content', content: '카페 투어 브이로그 촬영' },
];

export const INITIAL_AD_PROPOSALS = [
    {
        id: 'ad-dummy-1',
        creatorId: '2007',
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
        creatorId: '2001',
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
        creatorId: '2001',
        brandName: '미래에셋증권',
        campaignTitle: '2024년 하반기 경제 전망 세미나',
        budget: '1,000만원',
        status: 'accepted',
        requestDate: '2024-01-15',
        description: '오프라인 세미나 연사 초청 및 유튜브 라이브 송출 건입니다.'
    },
    {
        id: 'ad-3',
        creatorId: '2002',
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
        creatorId: '2004',
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
