import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const HealthSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.2s ease-in-out;
`;

export const HealthAlertBox = styled.div`
  position: relative;
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 1rem;
  padding: 1.5rem;
  overflow: hidden;
`;

export const AlertContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const AlertTextContent = styled.div`
  flex: 1;
`;

export const AlertBadge = styled.span`
  display: inline-block;
  background-color: white;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 0.75rem;
`;

export const AlertTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const AlertText = styled.p`
  font-size: 0.875rem;
  color: #1e40af;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export const AlertActionWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ActionButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

export const AlertIconWrapper = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: block;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 9999px;
    border: 1px solid #dbeafe;
  }
`;

export const DecorationCircle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: -2.5rem;
  margin-right: -2.5rem;
  width: 16rem;
  height: 16rem;
  background-color: #dbeafe;
  border-radius: 9999px;
  filter: blur(40px);
  opacity: 0.5;
`;

export const HistorySectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 0.25rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SectionTitleWithIcon = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  & > svg {
    color: #6b7280;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
`;

export const FilterLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-right: 0.25rem;
`;

export const DateInput = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  color: #374151;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const ResetButton = styled.button`
  margin-left: 0.5rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #4b5563;
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/* Updated HistoryItem with styled generic div instead of imported component */
export const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: white;
  border: 1px solid #f3f4f6;
  border-radius: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: #bfdbfe;
    background-color: #f8fafc;
  }
`;

export const HistoryItemContent = styled.div``;

export const HistoryTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const HistoryYearType = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
`;

export const HistoryStatus = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #6b7280;

  ${props => props.$status && (props.$status.includes('양호') || props.$status.includes('정상')) && css`
    background-color: #dcfce7;
    color: #166534;
  `}
  
  ${props => props.$status && (props.$status.includes('주의') || props.$status.includes('유소견')) && css`
    background-color: #ffedd5;
    color: #9a3412;
  `}

  ${props => props.$status && (props.$status.includes('위험') || props.$status.includes('재검')) && css`
    background-color: #fee2e2;
    color: #991b1b;
  `}
`;

export const HistoryDateRow = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DownloadButton = styled.button`
  color: #d1d5db;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
    background-color: #eff6ff;
  }
`;

export const EmptyState = styled.div`
  text-center: center;
  padding: 3rem 0;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px dashed #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const EmptyIcon = styled.div`
  color: #d1d5db;
  margin-bottom: 0.75rem;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;
