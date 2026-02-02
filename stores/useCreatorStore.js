import { create } from 'zustand';
import { INITIAL_CREATORS, INITIAL_EVENTS } from '../components/creator/shared/constants';

const INITIAL_SUPPORT_REQUESTS = [
    { id: 'sr-1', creatorId: '2', creatorName: '침착맨', type: 'legal', title: '저작권 관련 문의', content: '유튜브 영상 내 BGM 사용 관련 저작권 침해 경고 발생 건', requestDate: '2024-01-25', status: '진행중' },
    { id: 'sr-2', creatorId: '5', creatorName: '겜돌이', type: 'tax', title: '종합소득세 신고', content: '2023년 귀속 종합소득세 신고 자료 준비 요청', requestDate: '2024-01-20', status: '완료' },
];

export const useCreatorStore = create((set) => ({
    creators: INITIAL_CREATORS,
    creatorEvents: INITIAL_EVENTS,
    supportRequests: INITIAL_SUPPORT_REQUESTS,

    setCreators: (creators) => set({ creators }),

    updateCreator: (updatedCreator) => set((state) => ({
        creators: state.creators.map(c => c.id === updatedCreator.id ? updatedCreator : c)
    })),

    updateCreatorFromProfile: (profile) => set((state) => ({
        creators: state.creators.map(creator =>
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

    setCreatorEvents: (events) => set({ creatorEvents: events }),

    addSupportRequest: (newRequest) => set((state) => ({
        supportRequests: [newRequest, ...state.supportRequests]
    })),
    setSupportRequests: (requests) => set({ supportRequests: requests })
}));
