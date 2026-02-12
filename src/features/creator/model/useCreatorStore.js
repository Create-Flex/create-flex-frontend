import { create } from 'zustand';
import { creatorService } from '../api/creatorService';
import { scheduleService } from '../../calendar/api/scheduleService';

export const useCreatorStore = create((set, get) => ({
  creators: [],
  creatorEvents: [],
  supportRequests: [],
  isLoading: false,
  error: null,

  // 크리에이터 목록 조회
  fetchCreators: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await creatorService.getAllCreators();
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const mappedCreators = data.map(creator => ({
        id: creator.member_id,
        name: creator.member_name,
        platform: creator.creator_platform,
        subscribers: creator.creator_subscribe,
        category: creator.creator_category,
        status: creator.creator_status === 'ACTIVE' ? '활동중' :
          creator.creator_status === 'RETREAT' ? '은퇴' : '휴식중',
        contactInfo: creator.creator_main_contact,
        avatarUrl: creator.profile_image || '',
        coverUrl: creator.profile_banner || '',
        managementStartDate: creator.management_start_date || ''
      }));
      set({ creators: mappedCreators, isLoading: false });
    } catch (error) {
      console.error('크리에이터 목록 조회 실패:', error);
      set({
        error: error.response?.data?.message || '크리에이터 목록을 불러오는데 실패했습니다.',
        isLoading: false
      });
    }
  },

  // 크리에이터 목록 설정
  setCreators: (creators) => set({ creators }),

  // 크리에이터 일정 조회
  fetchCreatorEvents: async (year, month) => {
    set({ isLoading: true, error: null });
    try {
      const data = await scheduleService.getCreatorSchedules(year, month);
      // 백엔드 DTO를 프론트엔드 형식으로 매핑
      const mappedEvents = data.map(event => ({
        id: String(event.scheduleId),
        creatorId: String(event.creatorId),
        title: event.scheduleName,
        date: event.scheduleDate,
        type: event.scheduleType === 'PROMOTION' ? 'promotion' : event.scheduleType.toLowerCase(), // PROMOTION -> promotion
        content: event.scheduleDetail,
        partnerCreators: event.visitorIds ? event.visitorIds.map(v => String(v)) : [],
        writerName: event.memberName, // 작성자 이름
        visitorNames: event.visitorNames || [], // 방문자(참여자) 이름 목록
        isManagerCreated: event.memberRole === 'MANAGER' // 매니저가 생성한 일정 여부
      }));
      set({ creatorEvents: mappedEvents, isLoading: false });
    } catch (error) {
      console.error('크리에이터 일정 조회 실패:', error);
      set({
        error: error.response?.data?.message || '일정을 불러오는데 실패했습니다.',
        isLoading: false
      });
    }
  },

  // 크리에이터 일정 설정
  setCreatorEvents: (events) => set({ creatorEvents: events }),

  // 크리에이터 추가
  addCreator: (newCreator) => set((state) => ({
    creators: [newCreator, ...state.creators]
  })),

  // 크리에이터 업데이트
  updateCreator: (creatorId, updatedData) => set((state) => ({
    creators: state.creators.map(creator =>
      creator.id === creatorId
        ? { ...creator, ...updatedData }
        : creator
    )
  })),

  // 크리에이터 삭제
  removeCreator: (creatorId) => set((state) => ({
    creators: state.creators.filter(creator => creator.id !== creatorId)
  })),

  // 로딩 상태 설정
  setLoading: (loading) => set({ isLoading: loading }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 에러 초기화
  clearError: () => set({ error: null }),

  // 특정 크리에이터 찾기
  getCreatorById: (creatorId) => {
    const state = get();
    return state.creators.find(creator => creator.id === creatorId);
  }
}));