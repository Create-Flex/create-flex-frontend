import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

// Summary Cards
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; // gap-4
  margin-bottom: 2rem; // mb-8

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SummaryCard = styled.div`
  background-color: white;
  padding: 1.5rem; // p-6
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid #e5e7eb; // border-gray-200
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); // hover:shadow-md
  }
`;

export const CardLabel = styled.p`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
  font-weight: 700;
  margin-bottom: 0.5rem; // mb-2
`;

export const CardValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem; // gap-1
`;

export const CardValue = styled.h3`
  font-size: 1.875rem; // text-3xl
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const CardUnit = styled.span`
  font-size: 1rem; // text-base
  color: #9ca3af; // text-gray-400
  font-weight: 500;
`;

// Tabs
export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; // gap-6
  border-bottom: 1px solid #e5e7eb; // border-gray-200
  margin-bottom: 1.5rem; // mb-6
`;

export const TabButton = styled.button`
  padding-bottom: 0.75rem; // pb-3
  font-size: 0.875rem; // text-sm
  font-weight: 500;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  position: relative;
  
  ${props => props.$active
    ? css`
        color: black;
      `
    : css`
        color: #9ca3af; // text-gray-400
        &:hover { color: #374151; } // hover:text-gray-700
      `
  }
`;

export const TabCount = styled.span`
  font-size: 0.625rem; // text-[10px]
  padding: 0.125rem 0.375rem; // px-1.5 py-0.5
  border-radius: 9999px; // rounded-full
  font-weight: 700;
  
  ${props => {
    switch (props.$type) {
      case 'all': return css`background-color: #f3f4f6; color: #4b5563;`; // bg-gray-100 text-gray-600
      case 'approved': return css`background-color: #f0fdf4; color: #16a34a;`; // bg-green-50 text-green-600
      case 'rejected': return css`background-color: #fef2f2; color: #dc2626;`; // bg-red-50 text-red-600
      case 'pending': return css`background-color: #fff7ed; color: #ea580c;`; // bg-orange-50 text-orange-600
      default: return css`background-color: #f3f4f6; color: #4b5563;`;
    }
  }}
`;

export const ActiveIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
`;

// Filter Toolbar
export const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem; // gap-4
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
  width: 16rem; // w-64
  transition: all 0.2s;
  
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

export const DateFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  background-color: white;
  border: 1px solid #e5e7eb; // border-gray-200
  padding: 0.5rem 0.75rem; // px-3 py-2
  border-radius: 0.5rem; // rounded-lg
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
`;

export const DateInput = styled.input`
  font-size: 0.875rem; // text-sm
  background-color: transparent;
  cursor: pointer;
  color: #4b5563; // text-gray-600
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
  user-select: none;
`;

export const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem; // px-6 py-3
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$sortable ? '#f3f4f6' : 'transparent'}; // hover:bg-gray-100
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem; // gap-1
`;

export const TableBody = styled.tbody`
  font-size: 0.875rem; // text-sm
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6; // divide-gray-100
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem; // px-6 py-4
  font-size: ${props => props.$xs ? '0.75rem' : '0.875rem'};
  color: ${props => props.$color || 'inherit'};
  font-weight: ${props => props.$bold ? '700' : '400'};
  font-family: ${props => props.$mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit'};
`;

export const TypeBadge = styled.span`
  font-size: 0.75rem; // text-xs
  padding: 0.125rem 0.5rem; // px-2 py-0.5
  border-radius: 0.25rem; // rounded
  border: 1px solid;
  
  ${props => {
    switch (props.$type) {
      case '반차': return css`background-color: #faf5ff; border-color: #f3e8ff; color: #7e22ce;`; // purple
      case '병가': return css`background-color: #fef2f2; border-color: #fee2e2; color: #b91c1c;`; // red
      default: return css`background-color: #eff6ff; border-color: #dbeafe; color: #1d4ed8;`; // blue
    }
  }}
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem; // gap-1
  width: fit-content;
  
  ${props => {
    switch (props.$status) {
      case '승인됨': return css`color: #16a34a;`; // text-green-600
      case '대기중': return css`color: #ea580c; background-color: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem;`; // text-orange-600 bg-orange-50
      case '반려됨': return css`color: #ef4444;`; // text-red-500
      default: return css`color: #6b7280;`;
    }
  }}
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4); // bg-black/40
  z-index: 105;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; // p-4
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 1rem; // rounded-2xl
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); // shadow-2xl
  width: 100%;
  max-width: 28rem; // max-w-md
  overflow: hidden;
  border: 1px solid #e5e7eb; // border-gray-200
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem; // px-6 py-5
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5); // bg-gray-50/50
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  font-size: 1.125rem; // text-lg
  color: #111827; // text-gray-900
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  border-radius: 9999px;
  padding: 0.25rem; // p-1
  &:hover {
    color: #4b5563;
    background-color: #e5e7eb;
  }
`;

export const ModalContent = styled.div`
  padding: 2rem; // p-8
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // space-y-6
  max-height: 70vh;
  overflow-y: auto;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; // gap-4
`;

export const DetailItem = styled.div``;

export const DetailLabel = styled.label`
  display: block;
  font-size: 0.6875rem; // text-[11px]
  font-weight: 700;
  color: #9ca3af; // text-gray-400
  text-transform: uppercase;
  margin-bottom: 0.375rem; // mb-1.5
  letter-spacing: 0.05em; // tracking-wider
`;

export const DetailValueBox = styled.div`
  font-size: 0.875rem; // text-sm
  font-weight: 700;
  color: #111827; // text-gray-900
  background-color: #f9fafb; // bg-gray-50
  padding: 0.5rem 0.75rem; // px-3 py-2
  border-radius: 0.5rem; // rounded-lg
  border: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.$white && css`
    background-color: white;
    border-color: #e5e7eb;
    padding: 0.75rem 1rem; // px-4 py-3
    justify-content: space-between;
    border-radius: 0.75rem; // rounded-xl
  `}
  
  ${props => props.$multiline && css`
    min-height: 60px;
    font-weight: 400;
    color: #374151; // text-gray-700
    line-height: 1.625;
  `}
`;

export const DateBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  ${props => props.$right && css`text-align: right;`}
`;

export const DateLabelSmall = styled.span`
  font-size: 0.625rem; // text-[10px]
  color: #9ca3af; // text-gray-400
  margin-bottom: 0.125rem; // mb-0.5
`;

export const DetailCard = styled.div`
  padding: 1rem; // p-4
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid;
  
  ${props => {
    switch (props.$type) {
      case 'workation': return css`background-color: rgba(239, 246, 255, 0.5); border-color: #dbeafe;`; // bg-blue-50/50 border-blue-100
      case 'sick': return css`background-color: rgba(240, 253, 244, 0.5); border-color: #dcfce7;`; // bg-green-50/50 border-green-100
      case 'event': return css`background-color: rgba(250, 245, 255, 0.5); border-color: #f3e8ff;`; // bg-purple-50/50 border-purple-100
      case 'rejected': return css`background-color: #fef2f2; border-color: #fee2e2;`; // bg-red-50 border-red-100
      default: return css``;
    }
  }}
`;

export const DetailCardTitle = styled.h4`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.375rem; // gap-1.5
  margin-bottom: ${props => props.$mb ? '0.5rem' : '0'};
  
  ${props => {
    switch (props.$type) {
      case 'workation': return css`color: #1d4ed8;`; // text-blue-700
      case 'sick': return css`color: #15803d;`; // text-green-700
      case 'event': return css`color: #7e22ce;`; // text-purple-700
      case 'rejected': return css`color: #b91c1c;`; // text-red-700
      default: return css``;
    }
  }}
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem; // text-sm
  margin-bottom: 0.5rem; // space-y-3/4 equivalent
`;

export const DetailRowLabel = styled.span`
  color: #6b7280; // text-gray-500
`;

export const DetailRowValue = styled.span`
  font-weight: 700;
  color: #111827; // text-gray-900
  font-family: ${props => props.$mono ? 'monospace' : 'inherit'};
`;

export const DetailText = styled.p`
  font-size: 0.75rem; // text-xs
  color: ${props => props.$red ? '#991b1b' : '#374151'}; // text-red-800 : text-gray-700
  line-height: 1.625;
`;

export const RejectionInputContainer = styled.div`
  animation: ${slideIn} 0.2s ease-out;
  padding: 1rem; // p-4
  background-color: #fef2f2; // bg-red-50
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid #fecaca; // border-red-200
  display: flex;
  flex-direction: column;
  gap: 0.75rem; // space-y-3
`;

export const RejectionTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #fecaca; // border-red-200
  border-radius: 0.5rem; // rounded-lg
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.875rem; // text-sm
  height: 5rem; // h-20
  resize: none;
  background-color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 1px #ef4444; // ring-1 ring-red-500
  }
`;

export const RejectionActions = styled.div`
  display: flex;
  gap: 0.5rem; // gap-2
  justify-content: flex-end;
`;

export const RejectionBtn = styled.button`
  padding: 0.25rem 0.75rem; // px-3 py-1
  font-size: 0.75rem; // text-xs
  border-radius: 0.25rem; // rounded
  
  ${props => props.$primary
    ? css`background-color: #dc2626; color: white; font-weight: 700;` // bg-red-600
    : css`color: #6b7280; font-weight: 500;` // text-gray-500
  }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem; // p-6
  background-color: #f9fafb; // bg-gray-50
  border-top: 1px solid #f3f4f6; // border-gray-100
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem; // gap-3
  ${props => props.$end && css`justify-content: flex-end;`}
`;

export const ActionButton = styled.button`
  flex: 1;
  padding-top: 0.75rem; // py-3
  padding-bottom: 0.75rem;
  font-size: 0.875rem; // text-sm
  border-radius: 0.75rem; // rounded-xl
  font-weight: 700;
  transition: all 0.2s;
  
  ${props => props.$reject && css`
    border: 1px solid #fecaca; // border-red-200
    color: #dc2626; // text-red-600
    &:hover { background-color: #fef2f2; } // hover:bg-red-50
  `}
  
  ${props => props.$approve && css`
    background-color: black;
    color: white;
    &:hover { background-color: #1f2937; } // hover:bg-gray-800
  `}
  
  ${props => props.$close && css`
    background-color: #e5e7eb; // bg-gray-200
    color: #374151; // text-gray-700
    padding-left: 2rem; // px-8
    padding-right: 2rem;
    padding-top: 0.625rem; // py-2.5
    padding-bottom: 0.625rem;
    flex: initial;
    &:hover { background-color: #d1d5db; } // hover:bg-gray-300
  `}
`;

export const WorkationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem; // gap-3
`;

export const WorkationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem; // gap-1
  padding-top: 0.25rem; // pt-1
  border-top: 1px solid rgba(219, 234, 254, 0.5); // border-blue-100/50
`;

export const WorkationLabel = styled.span`
  font-size: 0.75rem; // text-xs
  color: #6b7280; // text-gray-500
`;

export const RejectionLabel = styled.label`
  display: block;
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #b91c1c; // text-red-700
`;
