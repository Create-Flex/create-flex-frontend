import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StatCardContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const StatLabel = styled.span`
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StatValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const StatValue = styled.span`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
`;

export const StatUnit = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
`;

export const StatSubLabel = styled.p`
  font-size: 0.6875rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

// Filter Bar
export const LoadingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SearchWrapper = styled.div`
  position: relative;
`;

export const SearchInput = styled.input`
  padding-left: 2.25rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  width: 16rem;
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

export const StatusSelect = styled.select`
  appearance: none;
  padding-left: 1rem;
  padding-right: 2.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-weight: 500;
  color: #374151;

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

export const DateRangePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const DateInput = styled.input`
  font-size: 0.8125rem;
  background-color: transparent;
  cursor: pointer;
  font-weight: 500;
  color: #4b5563;
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
  font-size: 0.6875rem;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: colors 0.2s;

  &:hover {
    color: black;
  }
`;

// Table
export const TableContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 5rem;
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: -0.025em;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: ${props => props.$center ? 'center' : 'left'};
`;

export const TableBody = styled.tbody`
  font-size: 0.875rem;
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
  text-align: ${props => props.$center ? 'center' : 'left'};
  vertical-align: middle;
  color: ${props => props.$color || 'inherit'};
`;

export const NameText = styled.div`
  font-weight: 700;
  color: #111827;
`;

export const TimeRange = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TimeText = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  color: ${props => props.$color || (props.$out ? '#1f2937' : '#2563eb')};
`;

export const NoDataText = styled.span`
  color: #d1d5db;
`;

export const Badge = styled.span`
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  border: 1px solid;
  
  ${props => {
    switch (props.$status) {
      case '정상': return css`background-color: #f0fdf4; color: #15803d; border-color: #bbf7d0;`;
      case '지각': return css`background-color: #fff7ed; color: #c2410c; border-color: #fed7aa;`;
      case '결근': return css`background-color: #fef2f2; color: #b91c1c; border-color: #fecaca;`;
      case '휴가': return css`background-color: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;`;
      default: return css`display: none;`;
    }
  }}
`;
