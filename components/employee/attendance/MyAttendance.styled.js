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

export const FilterHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: rgba(249, 250, 251, 0.5); // gray-50/50
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

export const StyledArrowRight = styled.div`
  color: #d1d5db; /* text-gray-300 */
  margin: 0 0.25rem; /* mx-1 */
  display: flex;
  align-items: center;
`;

export const FilterLabel = styled.span`
  font-size: 0.625rem; // text-[10px]
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
  
  &:focus {
    outline: none;
  }
`;

export const SelectContainer = styled.div`
  position: relative;
`;

export const StyledFilterIcon = styled.div`
  position: absolute;
  right: 0.75rem; /* right-3 */
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; /* text-gray-400 */
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const StatusSelect = styled.select`
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

export const Table = styled.table`
  width: 100%;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.6875rem; // text-[11px]
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  width: ${props => props.$width || 'auto'};
  text-align: ${props => props.$align || 'left'};
`;

export const TableBody = styled.tbody`
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: ${props => props.$color || 'inherit'};
  font-weight: ${props => props.$bold ? '700' : '400'};
  font-family: ${props => props.$mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit'};
  text-align: ${props => props.$align || 'left'};
`;

export const NoDataCell = styled.td`
  padding: 5rem 1.5rem;
  text-align: center;
  color: #9ca3af;
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  
  ${props => {
    switch (props.$status) {
      case 'normal':
        return css`color: #00C471;`;
      case 'late':
        return css`color: #ea580c;`; // orange-600
      case 'overtime':
        return css`color: #9333ea;`; // purple-600
      default:
        return css`color: #9ca3af; font-weight: 500;`;
    }
  }}
`;

export const TypeIcon = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
