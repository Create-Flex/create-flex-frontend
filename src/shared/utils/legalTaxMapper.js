// 백엔드 법률/세무 데이터를 프론트엔드 형식으로 변환
export const mapLegalTaxFromBackend = (backendData) => {
  const legalTaxId = backendData.legal_tax_id ?? backendData.legalTaxId;
  const creatorId = backendData.creator_id ?? backendData.creatorId;
  const creatorName = backendData.creator_name ?? backendData.creatorName;
  const legalTaxType = backendData.legal_tax_type ?? backendData.legalTaxType;
  const legalTaxName = backendData.legal_tax_name ?? backendData.legalTaxName;
  const legalTaxDetail = backendData.legal_tax_detail ?? backendData.legalTaxDetail;
  const legalTaxStatus = backendData.legal_tax_status ?? backendData.legalTaxStatus;

  return {
    id: legalTaxId,
    creatorId: creatorId,
    creatorName: creatorName,
    type: mapTypeFromBackend(legalTaxType),
    title: legalTaxName,
    content: legalTaxDetail,
    status: mapStatusFromBackend(legalTaxStatus),
    requestDate: new Date().toISOString().split('T')[0] // 백엔드에 날짜 필드 추가 필요시 수정
  };
};

// 백엔드 타입을 프론트엔드 형식으로 변환
const mapTypeFromBackend = (backendType) => {
  const typeMap = {
    'LEGAL': 'legal',
    'TAX': 'tax'
  };
  return typeMap[backendType] || 'legal';
};

// 백엔드 상태를 프론트엔드 형식으로 변환
const mapStatusFromBackend = (backendStatus) => {
  const statusMap = {
    'NOT_RECEIVED': '접수',
    'CONTACTED': '연락됨',
    'IN_PROGRESS': '진행중',
    'DONE': '완료'
  };
  return statusMap[backendStatus] || '접수';
};

// 프론트엔드 타입을 백엔드 형식으로 변환
export const mapTypeToBackend = (frontendType) => {
  const typeMap = {
    'legal': 'LEGAL',
    'tax': 'TAX'
  };
  return typeMap[frontendType] || 'LEGAL';
};

// 프론트엔드 상태를 백엔드 형식으로 변환
export const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    '접수': 'NOT_RECEIVED',
    '연락됨': 'CONTACTED',
    '진행중': 'IN_PROGRESS',
    '완료': 'DONE'
  };
  return statusMap[frontendStatus] || 'NOT_RECEIVED';
};