import { UserRole } from '../../../shared/constants/enums';

export const getNavigationPath = (type, role) => {
    // role 속성명이 'role' 또는 'memberRole'일 수 있으므로 둘 다 체크
    const isAdmin = role === UserRole.ADMINISTRATOR || role === 'ADMINISTRATOR';
    const isManager = role === UserRole.MANAGER || role === 'MANAGER';
    const isCreator = role === UserRole.CREATOR || role === 'CREATOR';

    // 법률/세무 관련
    if (type.startsWith('LEGAL_TAX')) {
        if (type === 'LEGAL_TAX_REGISTERED' && isAdmin) return '/hr/support';
        if (type === 'LEGAL_TAX_APPROVED' && isManager) return '/employee-creator-support';
        return '/support';
    }

    // 건강관리 관련
    if (type.includes('HEALTH')) {
        if (isAdmin) return '/hr/health';
        if (isManager) return '/employee-creator-health';
        return '/creator-health';
    }

    // 광고 캠페인 관련
    if (type.startsWith('ADVERTISEMENT')) {
        if (isManager) return '/employee-creator-ads';
        if (isCreator) return '/my-creator';
        return '/mypage';
    }

    // 일정 관련
    if (type.startsWith('SCHEDULE')) {
        if (isManager) return '/employee-creator-calendar';
        if (isCreator) return '/creator-schedule';
        return '/schedule';
    }

    // 휴가 관련
    if (type.startsWith('VACATION')) {
        if (type === 'VACATION_REQUESTED' && isAdmin) return '/hr/vacation';
        return '/vacation';
    }

    return '/mypage';
};
