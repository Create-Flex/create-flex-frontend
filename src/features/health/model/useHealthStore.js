import { create } from 'zustand';
import { INITIAL_HEALTH_RECORDS } from '../../../constants';

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

export const useHealthStore = create((set) => ({
    // 직원 건강 기록
    employeeHealthRecords: INITIAL_HEALTH_RECORDS,

    // 크리에이터 건강 기록
    creatorHealthRecords: INITIAL_CREATOR_HEALTH,
    creatorIssueLogs: INITIAL_CREATOR_ISSUES,

    // 직원 건강 관리
    setEmployeeHealthRecords: (records) => set({ employeeHealthRecords: records }),
    addEmployeeHealthRecord: (newRecord) => set((state) => ({
        employeeHealthRecords: [newRecord, ...state.employeeHealthRecords]
    })),

    // 크리에이터 건강 관리
    setCreatorHealthRecords: (records) => set({ creatorHealthRecords: records }),
    addCreatorHealthRecord: (newRecord) => set((state) => ({
        creatorHealthRecords: [newRecord, ...state.creatorHealthRecords]
    })),

    // 크리에이터 이슈 관리
    setCreatorIssueLogs: (logs) => set({ creatorIssueLogs: logs }),
    addCreatorIssueLog: (newLog) => set((state) => ({
        creatorIssueLogs: [newLog, ...state.creatorIssueLogs]
    }))
}));
