import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

// Stats Section
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; // gap-6
  margin-bottom: 2.5rem; // mb-10

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatCardContainer = styled.div`
  background-color: white;
  padding: 1.25rem; // p-5
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid #e5e7eb; // border-gray-200
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem; // mb-3
`;

export const StatLabel = styled.span`
  color: #9ca3af; // text-gray-400
  font-size: 0.6875rem; // text-[11px]
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em; // tracking-wider
`;

export const IconWrapper = styled.div`
  padding: 0.5rem; // p-2
  border-radius: 0.5rem; // rounded-lg
  
  ${props => props.$colorClass === 'green' && css`background-color: #f0fdf4; color: #16a34a;`} // green-50, green-600
  ${props => props.$colorClass === 'orange' && css`background-color: #fff7ed; color: #ea580c;`} // orange-50, orange-600
  ${props => props.$colorClass === 'red' && css`background-color: #fef2f2; color: #dc2626;`} // red-50, red-600
  ${props => props.$colorClass === 'purple' && css`background-color: #faf5ff; color: #9333ea;`} // purple-50, purple-600
`;

export const StatValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem; // gap-1
`;

export const StatValue = styled.span`
  font-size: 1.5rem; // text-2xl
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const StatUnit = styled.span`
  font-size: 0.75rem; // text-xs
  color: #9ca3af; // text-gray-400
  font-weight: 500;
`;

export const StatSubLabel = styled.p`
  font-size: 0.625rem; // text-[10px]
  color: #9ca3af; // text-gray-400
  margin-top: 0.25rem; // mt-1
`;

// Controls
export const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem; // mb-6
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; // gap-3
`;

export const SearchWrapper = styled.div`
  position: relative;
`;

export const SearchInput = styled.input`
  padding-left: 2.25rem; // pl-9
  padding-right: 1rem; // pr-4
  padding-top: 0.5rem; // py-2
  padding-bottom: 0.5rem;
  font-size: 0.875rem; // text-sm
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  width: 14rem; // w-56
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const ResultSelect = styled.select`
  padding-left: 0.75rem; // pl-3
  padding-right: 2rem; // pr-8
  padding-top: 0.5rem; // py-2
  padding-bottom: 0.5rem;
  font-size: 0.875rem; // text-sm
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  width: 10rem; // w-40
  background-color: white;
  appearance: none;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const SelectIconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const DateFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  background-color: white;
  border: 1px solid #e5e7eb; // border-gray-200
  padding: 0.5rem 0.75rem; // px-3 py-2
  border-radius: 0.5rem; // rounded-lg
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const DateLabel = styled.span`
  font-size: 0.625rem; // text-[10px]
  font-weight: 700;
  color: #9ca3af; // text-gray-400
  text-transform: uppercase;
  letter-spacing: -0.05em; // tracking-tighter
  margin-right: 0.25rem; // mr-1
`;

export const DateInput = styled.input`
  font-size: 0.875rem; // text-sm
  background-color: transparent;
  width: 6.5rem;
  cursor: pointer;
  color: #4b5563; // text-gray-600
  font-weight: 500;
  border: none;
  &:focus { outline: none; }
`;

export const DateRangeArrow = styled.div`
  color: #d1d5db; // text-gray-300
  margin: 0 0.25rem; // mx-1
  display: flex;
  align-items: center;
`;

export const ResetButton = styled.button`
  font-size: 0.75rem; // text-xs
  color: #9ca3af; // text-gray-400
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em; // tracking-widest
  transition: colors 0.2s;

  &:hover {
    color: black;
  }
`;

// Table
export const TableContainer = styled.div`
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  margin-bottom: 2.5rem; // mb-10
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb; // bg-gray-50
  border-bottom: 1px solid #e5e7eb; // border-gray-200
  font-size: 0.75rem; // text-xs
  font-weight: 500;
  color: #6b7280; // text-gray-500
  text-transform: uppercase;
`;

export const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem; // px-6 py-3
  text-align: ${props => props.$center ? 'center' : props.$right ? 'right' : 'left'};
`;

export const TableBody = styled.tbody`
  font-size: 0.875rem; // text-sm
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6; // divide-gray-100
  }
`;

export const ActionButtonsData = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; // gap-2
  opacity: 0;
  transition: opacity 0.2s;
`;

export const ActionIconBtn = styled.button`
  padding: 0.375rem; // p-1.5
  border-radius: 0.25rem; // rounded
  border: 1px solid #e5e7eb; // border-gray-200
  color: #6b7280; // text-gray-500
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  
  &:hover {
    background-color: white;
    color: ${props => props.$danger ? '#dc2626' : '#2563eb'}; // red-600 : blue-600
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb; // bg-gray-50
  }
  
  /* Group hover effect for specific cells handled via CSS sibling selectors if needed,
     but styled-components handles hover on row easily. */
  &:hover td:first-child {
    color: #2563eb; // group-hover:text-blue-600 equivalent
  }
  
  &:hover ${ActionButtonsData} {
    opacity: 1;
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem; // px-6 py-4
  text-align: ${props => props.$center ? 'center' : props.$right ? 'right' : 'left'};
  color: ${props => props.$color || 'inherit'};
  font-weight: ${props => props.$bold ? '700' : '400'};
  transition: color 0.2s;
`;

export const ResultBadge = styled.span`
  padding: 0.125rem 0.5rem; // px-2 py-0.5
  border-radius: 0.25rem; // rounded
  font-size: 0.75rem; // text-xs
  border: 1px solid;
  font-weight: 700;
  
  ${props => {
    const res = props.$result || '';
    if (res.includes('양호')) return css`background-color: #f0fdf4; color: #15803d; border-color: #bbf7d0;`;
    if (res.includes('경미')) return css`background-color: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;`;
    if (res.includes('주의')) return css`background-color: #fff7ed; color: #c2410c; border-color: #fed7aa;`;
    if (res.includes('위험')) return css`background-color: #fef2f2; color: #b91c1c; border-color: #fecaca;`;
    if (res.includes('재검')) return css`background-color: #faf5ff; color: #7e22ce; border-color: #e9d5ff;`;
    return css`background-color: #f9fafb; color: #6b7280; border-color: #e5e7eb;`;
  }}
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3); // black/30
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem; // rounded-xl
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); // shadow-2xl
  width: 100%;
  max-width: 28rem; // max-w-md
  overflow: hidden;
  border: 1px solid #e5e7eb; // border-gray-200
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.25rem; // px-5 py-4
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb; // bg-gray-50
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  border-radius: 0.25rem;
  padding: 0.25rem;
  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem; // p-6
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // space-y-6
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; // space-y-4
`;

export const FormGroup = styled.div``;
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem; // gap-4
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #9ca3af; // text-gray-400
  margin-bottom: 0.25rem; // mb-1
  text-transform: uppercase;
`;

export const FormInput = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.25rem; // rounded
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.875rem; // text-sm
  outline: none;
  background-color: ${props => props.$disabled ? '#f9fafb' : 'white'};
  
  &:focus {
    border-color: black;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  background-color: white;
  
  &:focus {
    border-color: black;
  }
`;

export const InfoValue = styled.div`
  font-size: 0.875rem; // text-sm
  font-weight: 500;
  color: ${props => props.$color || '#374151'}; // text-gray-700
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const AttachmentCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  padding: 0.75rem; // p-3
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  &:hover {
    border-color: #93c5fd; // hover:border-blue-300
  }
`;

export const FileIconWrapper = styled.div`
  padding: 0.5rem; // p-2
  background-color: #fef2f2; // bg-red-50
  color: #dc2626; // text-red-600
  border-radius: 0.25rem; // rounded
`;

export const FileName = styled.div`
  font-size: 0.875rem; // text-sm
  font-weight: 500;
  color: #111827; // text-gray-900
  
  ${AttachmentCard}:hover & {
    color: #2563eb; // group-hover:text-blue-600
  }
`;

export const FileSize = styled.div`
  font-size: 0.75rem; // text-xs
  color: #9ca3af; // text-gray-400
`;

export const DownloadBtn = styled.button`
  color: #9ca3af;
  padding: 0.5rem;
  border-radius: 9999px;
  
  ${AttachmentCard}:hover & {
    color: #2563eb;
    background-color: #eff6ff; // hover:bg-blue-50
  }
`;

export const AttachmentSection = styled.div`
  background-color: #f9fafb; // bg-gray-50
  border-radius: 0.5rem; // rounded-lg
  padding: 1rem; // p-4
  border: 1px solid #f3f4f6; // border-gray-100
`;

export const AttachmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem; // mb-2
`;

export const AttachmentLabel = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #6b7280; // text-gray-500
`;

export const FileContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; // gap-3
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem; // gap-2
`;

export const Disclaimer = styled.div`
  padding: 0.75rem; // p-3
  font-size: 0.6875rem; // text-[11px]
  color: #9ca3af; // text-gray-400
  line-height: relaxed;
  background-color: rgba(239, 246, 255, 0.5); // bg-blue-50/50
  border-radius: 0.25rem; // rounded
  text-align: center;
`;

export const ModalFooter = styled.div`
  padding: 1rem; // p-4
  background-color: #f9fafb; // bg-gray-50
  border-top: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: ${props => props.$between ? 'space-between' : 'flex-end'};
  gap: 0.5rem;
`;

export const FooterBtn = styled.button`
  padding: 0.5rem 1rem; // px-4 py-2
  font-size: 0.875rem; // text-sm
  border-radius: 0.5rem; // rounded-lg
  font-weight: 500;
  transition: colors 0.2s;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  ${props => props.$primary && css`
    background-color: black;
    color: white;
    font-weight: 700;
    &:hover { background-color: #1f2937; } // hover:bg-gray-800
  `}

  ${props => props.$secondary && css`
    color: #4b5563; // text-gray-600
    &:hover { background-color: #e5e7eb; } // hover:bg-gray-200
  `}

  ${props => props.$outline && css`
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #374151;
    &:hover { background-color: #f9fafb; }
  `}

  ${props => props.$danger && css`
    color: #dc2626; // text-red-600
    &:hover { background-color: #fef2f2; } // hover:bg-red-50
  `}
`;
