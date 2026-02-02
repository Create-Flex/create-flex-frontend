import { create } from 'zustand';
import { EMPLOYEE_PROFILE_DATA } from '../constants';

export const useUserStore = create((set) => ({
    userProfile: EMPLOYEE_PROFILE_DATA,

    setUserProfile: (profile) => set({ userProfile: profile }),

    updateProfile: (updatedProfile) => {
        set({ userProfile: updatedProfile });
    }
}));
