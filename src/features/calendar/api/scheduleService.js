import axiosInstance from '../../../api/axios';

export const scheduleService = {
  // 일정 조회
  getSchedules: async (year, month) => {
    const formattedMonth = `${year}-${String(month).padStart(2, '0')}`;
    const response = await axiosInstance.get(`/schedules/me?month=${formattedMonth}`);
    return response.data;
  },

  // 크리에이터 일정 조회 
  getCreatorSchedules: async (year, month) => {
    const formattedMonth = `${year}-${String(month).padStart(2, '0')}`;
    const response = await axiosInstance.get(`/schedules/creator?month=${formattedMonth}`);
    return response.data;
  },
  // 일정 등록
  createSchedule: async (scheduleData) => {
    const response = await axiosInstance.post('/schedules/', scheduleData);
    return response.data;
  },

  // 일정 수정
  updateSchedule: async (id, scheduleData) => {
    const response = await axiosInstance.patch(`/schedules/${id}`, scheduleData);
    return response.data;
  },

  // 일정 삭제
  deleteSchedule: async (id) => {
    const response = await axiosInstance.delete(`/schedules/${id}`);
    return response.data;
  }

};
