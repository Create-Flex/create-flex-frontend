import { create } from 'zustand';
import {
    INITIAL_VACATION_LOGS,
    INITIAL_SCHEDULE_EVENTS,
    INITIAL_SCHEDULE_TEMPLATES
} from '../constants';
import { INITIAL_TASKS } from '../components/creator/shared/constants';

export const useScheduleStore = create((set) => ({
    scheduleEvents: INITIAL_SCHEDULE_EVENTS,
    scheduleTemplates: INITIAL_SCHEDULE_TEMPLATES,
    vacationLogs: INITIAL_VACATION_LOGS,
    allTasks: (() => {
        const flatList = [];
        Object.entries(INITIAL_TASKS).forEach(([cId, tasks]) => {
            tasks.forEach(t => flatList.push({ ...t, creatorId: cId }));
        });
        return flatList;
    })(),

    setScheduleEvents: (events) => set({ scheduleEvents: events }),
    setScheduleTemplates: (templates) => set({ scheduleTemplates: templates }),
    setVacationLogs: (logs) => set({ vacationLogs: logs }),
    addVacationLog: (log) => set((state) => ({ vacationLogs: [log, ...state.vacationLogs] })),

    addTask: (title, creatorId, assigneeName) => set((state) => {
        const newTask = {
            id: Date.now().toString(),
            title,
            status: '진행중',
            assignee: assigneeName || '미정',
            creatorId: creatorId
        };
        return { allTasks: [...state.allTasks, newTask] };
    }),

    toggleTask: (taskId) => set((state) => ({
        allTasks: state.allTasks.map(t =>
            t.id === taskId
                ? { ...t, status: t.status === '진행중' ? '완료됨' : '진행중' }
                : t
        )
    })),

    deleteTask: (taskId) => set((state) => ({
        allTasks: state.allTasks.filter(t => t.id !== taskId)
    }))
}));
