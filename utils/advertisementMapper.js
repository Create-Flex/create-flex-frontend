// 백엔드 광고 데이터를 프론트엔드 형식으로 변환
export const mapAdvertisementFromBackend = (backendAd) => {
  // JSON snake_case 필드 우선 처리
  const promotionId = backendAd.promotion_id ?? backendAd.promotionId;
  const creatorId = backendAd.creator_id ?? backendAd.creatorId;
  const creatorName = backendAd.creator_name ?? backendAd.creatorName;
  const promotionClient = backendAd.promotion_client ?? backendAd.promotionClient;
  const promotionName = backendAd.promotion_name ?? backendAd.promotionName;
  const promotionFee = backendAd.promotion_fee ?? backendAd.promotionFee;
  const promotionDetail = backendAd.promotion_detail ?? backendAd.promotionDetail;
  const createdAt = backendAd.created_at ?? backendAd.createdAt;
  const promotionTargetDate = backendAd.promotion_target_date ?? backendAd.promotionTargetDate;
  const promotionStatus = backendAd.promotion_status ?? backendAd.promotionStatus;

  return {
    id: promotionId,
    creatorId: creatorId,
    creatorName: creatorName,
    brandName: promotionClient,
    campaignTitle: promotionName,
    budget: promotionFee,
    description: promotionDetail,
    requestDate: createdAt,
    targetDate: promotionTargetDate,
    status: mapPromotionStatus(promotionStatus)
  };
};

// 백엔드 광고 상태를 프론트엔드 형식으로 변환
const mapPromotionStatus = (backendStatus) => {
  const statusMap = {
    'WAITING': 'pending',
    'ACCEPTED': 'accepted',
    'REJECTED': 'rejected'
  };
  return statusMap[backendStatus] || 'pending';
};

// 프론트엔드 광고 상태를 백엔드 형식으로 변환
export const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    'pending': 'WAITING',
    'accepted': 'ACCEPTED',
    'rejected': 'REJECTED'
  };
  return statusMap[frontendStatus] || 'WAITING';
};