import { UserRole } from '../enums';

// 백엔드 MemberRole을 프론트엔드 UserRole로 매핑
export const mapBackendRoleToFrontend = (backendRole) => {
  const roleMap = {
    'EMPLOYEE': UserRole.EMPLOYEE,
    'MANAGER': UserRole.EMPLOYEE, // 매니저도 직원 권한
    'ADMINISTRATOR': UserRole.ADMIN,
    'CREATOR': UserRole.CREATOR,
  };

  return roleMap[backendRole] || UserRole.EMPLOYEE;
};

// 권한별 리다이렉트 경로 결정
export const getRedirectPathByRole = (role) => {
  switch (role) {
    case UserRole.ADMIN:
      return '/mypage'; // 관리자는 마이페이지
    case UserRole.CREATOR:
      return '/creator-schedule'; // 크리에이터는 일정 페이지
    case UserRole.EMPLOYEE:
    default:
      return '/mypage'; // 직원은 마이페이지
  }
};