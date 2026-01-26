import { create } from 'zustand';
import { INITIAL_CREATORS, INITIAL_EVENTS } from '../components/creator/shared/constants';

const INITIAL_CREATOR_HEALTH = [
    { id: '1', name: '슈카월드', lastCheck: '2023-12-10', score: 95, result: '정상', status: '재직중' },
    { id: '2', name: '침착맨', lastCheck: '2023-11-05', score: 65, result: '주의', status: '재직중' },
    { id: '3', name: '요리보고', lastCheck: '2024-01-05', score: 88, result: '정상', status: '대기중' },
    { id: '4', name: '여행가제이', lastCheck: '2023-09-20', score: 45, result: '위험', status: '재직중' },
    { id: '6', name: '치즈냥이', lastCheck: '2024-01-10', score: 0, result: '재검필요', status: '재직중' },
];

const INITIAL_CREATOR_ISSUES = [
    { id: 1, creator: '침착맨', date: '2024-01-15', category: '경미', description: '최근 방송 중 피로감 호소, 가벼운 번아웃 증상', status: '상담중' },
    { id: 2, creator: '치즈냥이', date: '2024-01-18', category: '심각', description: '불면증 및 무기력증 호소, 전문 상담 권고', status: '휴식권고' },
    { id: 3, creator: '슈카월드', date: '2023-12-20', category: '정상', description: '정기 심리 상담 결과 양호, 특이사항 없음', status: '모니터링' },
];

const INITIAL_SUPPORT_REQUESTS = [
    { id: 'sr-1', creatorId: '2', creatorName: '침착맨', type: 'legal', title: '저작권 관련 문의', content: '유튜브 영상 내 BGM 사용 관련 저작권 침해 경고 발생 건', requestDate: '2024-01-25', status: '진행중' },
    { id: 'sr-2', creatorId: '5', creatorName: '겜돌이', type: 'tax', title: '종합소득세 신고', content: '2023년 귀속 종합소득세 신고 자료 준비 요청', requestDate: '2024-01-20', status: '완료' },
];

export const useCreatorStore = create((set) => ({
    creators: INITIAL_CREATORS,
    creatorHealthRecords: INITIAL_CREATOR_HEALTH,
    creatorIssueLogs: INITIAL_CREATOR_ISSUES,
    creatorEvents: INITIAL_EVENTS,
    supportRequests: INITIAL_SUPPORT_REQUESTS,

    setCreators: (creators) => set({ creators }),

    updateCreator: (updatedCreator) => set((state) => ({
        creators: state.creators.map(c => c.id === updatedCreator.id ? updatedCreator : c)
    })),

    updateCreatorFromProfile: (profile) => set((state) => ({
        creators: state.creators.map(creator =>
            // Logic from App.jsx: match by ID (assuming user.id matched creator.id)
            // But here we might need to pass the ID explicitly or assume profile has employeeId which is the creator ID
            creator.id === profile.employeeId
                ? {
                    ...creator,
                    name: profile.name,
                    avatarUrl: profile.avatarUrl,
                    coverUrl: profile.coverUrl || creator.coverUrl,
                    contactInfo: profile.phone,
                }
                : creator
        )
    })),

    setCreatorHealthRecords: (records) => set({ creatorHealthRecords: records }),
    setCreatorIssueLogs: (logs) => set({ creatorIssueLogs: logs }),
    setCreatorEvents: (events) => set({ creatorEvents: events }),

    addSupportRequest: (newRequest) => set((state) => ({
        supportRequests: [newRequest, ...state.supportRequests]
    })),
    setSupportRequests: (requests) => set({ supportRequests: requests })
}));
