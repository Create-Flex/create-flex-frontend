// 백엔드 크리에이터 데이터를 프론트엔드 형식으로 변환
export const mapCreatorFromBackend = (backendCreator) => {
  // JSON snake_case 필드 우선 처리
  const memberId = backendCreator.member_id ?? backendCreator.memberId;
  const memberName = backendCreator.member_name ?? backendCreator.memberName;
  const memberAccount = backendCreator.member_account ?? backendCreator.memberAccount;
  const creatorPlatform = backendCreator.creator_platform ?? backendCreator.creatorPlatform;
  const creatorSubscribe = backendCreator.creator_subscribe ?? backendCreator.creatorSubscribe;
  const creatorCategory = backendCreator.creator_category ?? backendCreator.creatorCategory;
  const creatorStatus = backendCreator.creator_status ?? backendCreator.creatorStatus;
  const managerId = backendCreator.manager_id ?? backendCreator.managerId;
  const managerName = backendCreator.manager_name ?? backendCreator.managerName;
  const profileImage = backendCreator.profile_image ?? backendCreator.profileImage;
  const profileBanner = backendCreator.profile_banner ?? backendCreator.profileBanner;
  const creatorMainContact = backendCreator.creator_main_contact ?? backendCreator.creatorMainContact;

  return {
    id: String(memberId),
    name: memberName,
    loginId: memberAccount,
    platform: mapPlatformFromBackend(creatorPlatform),
    subscribers: creatorSubscribe,
    category: creatorCategory,
    status: mapStatusFromBackend(creatorStatus),
    managerId: managerId,
    manager: managerName || '담당자 없음',
    avatarUrl: profileImage || '',
    bannerUrl: profileBanner || '',
    channelName: memberName,
    contactInfo: creatorMainContact || '', 
  };
};

// 백엔드 플랫폼을 프론트엔드 형식으로 변환
const mapPlatformFromBackend = (backendPlatform) => {
  if (!backendPlatform) return 'YouTube';
  
  const platformMap = {
    'YOUTUBE': 'YouTube',
    'TWITCH': 'Twitch',
    'CHZZK': 'Chzzk',
    'INSTAGRAM': 'Instagram',
    'TIKTOK': 'TikTok'
  };
  
  return platformMap[backendPlatform] || backendPlatform;
};

// 백엔드 상태를 프론트엔드 형식으로 변환
const mapStatusFromBackend = (backendStatus) => {
  if (!backendStatus) return '활동중';
  
  const statusMap = {
    'RETREAT': '은퇴',
    'ACTIVE': '활동중',
    'RESTING': '휴식중'
  };
  
  return statusMap[backendStatus] || '활동중';
};

// 프론트엔드 플랫폼을 백엔드 형식으로 변환
export const mapPlatformToBackend = (frontendPlatform) => {
  const platformMap = {
    'YouTube': 'YOUTUBE',
    'Twitch': 'TWITCH',
    'Chzzk': 'CHZZK',
    'Instagram': 'INSTAGRAM',
    'TikTok': 'TIKTOK'
  };
  return platformMap[frontendPlatform] || 'YOUTUBE';
};

// 프론트엔드 상태를 백엔드 형식으로 변환
export const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    '은퇴': 'RETREAT',
    '활동중': 'ACTIVE',
    '휴식중': 'RESTING'
  };
  return statusMap[frontendStatus] || 'ACTIVE';
};