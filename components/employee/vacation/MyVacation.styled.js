import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
`;

export const TableContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 5rem;
`;

export const ControlBar = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: rgba(249, 250, 251, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const DateRangePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const FilterLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: -0.05em;
  margin-right: 0.25rem;
`;

export const DateInput = styled.input`
  font-size: 0.875rem;
  background-color: transparent;
  cursor: pointer;
  border: none;
  &:focus { outline: none; }
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const TypeSelect = styled.select`
  padding-left: 0.75rem;
  padding-right: 2.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  appearance: none;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  min-width: 140px;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const RequestButton = styled.button`
  font-size: 0.75rem;
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 700;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;

  &:hover {
    background-color: #1f2937;
  }
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: ${props => props.$align || 'left'};
`;

export const TableBody = styled.tbody`
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: ${props => props.$bold ? '700' : '400'};
  color: ${props => props.$color || 'inherit'};
  text-align: ${props => props.$align || 'left'};
`;

export const TypeBadge = styled.span`
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px; // full
  border: 1px solid;
  font-weight: 700;
  
  ${props => {
    switch (props.$type) {
      case '반차':
        return css`background-color: #faf5ff; border-color: #f3e8ff; color: #7e22ce;`; // purple
      case '워케이션':
        return css`background-color: #eef2ff; border-color: #e0e7ff; color: #4338ca;`; // indigo
      default:
        return css`background-color: #eff6ff; border-color: #dbeafe; color: #1d4ed8;`; // blue
    }
  }}
`;

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  
  ${props => {
    switch (props.$status) {
      case '반려됨':
        return css`background-color: #fef2f2; color: #ef4444;`;
      case '대기중':
        return css`background-color: #fff7ed; color: #ea580c;`;
      default: // 승인됨 등
        return css`background-color: #f0fdf4; color: #16a34a;`;
    }
  }}
`;

// Modals
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3); // black/30
  z-index: ${props => props.$zIndex || 100};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: ${props => props.$maxWidth || '24rem'};
  border: 1px solid #e5e7eb;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  background-color: ${props => props.$bg || 'white'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.$size || '1rem'};
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  &:hover { color: #4b5563; }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  position: sticky;
  bottom: 0;
`;

// Specific Modal Elements
export const InfoLabel = styled.label`
  display: block;
  font-size: 0.6875rem; // text-[11px]
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
  letter-spacing: 0.05em;
`;

export const InfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  background-color: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

export const DetailInfoBox = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  
  ${props => {
    switch (props.$type) {
      case '워케이션': return css`background-color: #eff6ff80; border-color: #dbeafe;`; // blue
      case '병가': return css`background-color: #f0fdf480; border-color: #bbf7d0;`; // green
      case '경조사': return css`background-color: #faf5ff80; border-color: #f3e8ff;`; // purple
      default: return css`background-color: #f9fafb; border-color: #f3f4f6;`;
    }
  }}
`;

export const DetailHeader = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${props => props.$color || '#374151'};
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: ${props => props.$mb ? '0.75rem' : '0'};
  padding-top: ${props => props.$pt ? '0.25rem' : '0'};
  border-top: ${props => props.$border ? '1px solid rgba(0,0,0,0.05)' : 'none'};
  
  span:first-child { color: #6b7280; }
  span:last-child { font-weight: 700; color: #111827; }
  
  ${props => props.$col && css`
    flex-direction: column;
    gap: 0.25rem;
    span:last-child { font-weight: 400; color: #374151; line-height: 1.5; }
  `}
`;

export const PrimaryButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: black;
  color: white;
  border-radius: 0.5rem;
  font-weight: 700;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: #1f2937;
  }
`;

export const DetailDateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const DetailDateItem = styled.div`
  display: flex;
  flex-direction: column;
  text-align: ${props => props.$align || 'left'};
`;

export const DateLabel = styled.span`
  font-size: 0.625rem; /* text-[10px] */
  color: #9ca3af;
  margin-bottom: 0.125rem;
`;

export const ReasonBox = styled.div`
  font-size: 0.875rem;
  color: #374151;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  line-height: 1.625;
  min-height: 60px;
`;

export const RejectionBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  border-radius: 0.75rem;
  border: 1px solid #fee2e2;
`;

export const RejectionText = styled.p`
  font-size: 0.75rem;
  color: #991b1b;
  line-height: 1.625;
  font-weight: 500;
`;

export const SelectIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  display: flex;
`;

export const TruncatedContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

export const CenterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MonoText = styled.span`
  font-family: monospace;
`;
