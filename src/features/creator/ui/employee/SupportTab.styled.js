import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const SupportCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const IconBox = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  
  ${props => props.$type === 'legal' ? css`
    background-color: #eff6ff;
    color: #2563eb;
  ` : css`
    background-color: #f0fdf4;
    color: #16a34a;
  `}
`;

export const CardTitleGroup = styled.div``;

export const CardTitle = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
`;

export const CardDesc = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SupportList = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
`;

export const ListLabel = styled.p`
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

export const List = styled.ul`
  list-style-type: disc;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #4b5563;
`;

export const ListItem = styled.li``;

export const ActionButton = styled.button`
  width: 100%;
  padding: 0.625rem;
  background-color: black;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1f2937;
  }
`;

export const HistorySection = styled.div`
  grid-column: 1 / -1;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

export const HistoryHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const HistoryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const HistoryDesc = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const TableContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background-color: #f9fafb;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 700;
`;

export const Th = styled.th`
  padding: 1rem 1.5rem;
  ${props => props.$center && css`text-align: center;`}
  ${props => props.$width && css`width: ${props.$width};`}
`;

export const Tbody = styled.tbody`
  font-size: 0.875rem;
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const Tr = styled.tr`
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const Td = styled.td`
  padding: 1rem 1.5rem;
  ${props => props.$center && css`text-align: center;`}
  ${props => props.$mono && css`font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #6b7280;`}
  ${props => props.$bold && css`font-weight: 700; color: #111827;`}
  ${props => props.$medium && css`font-weight: 500; color: #111827;`}
`;

export const TypeBadge = styled.span`
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid;
  
  ${props => props.$type === 'legal' ? css`
    background-color: #eff6ff;
    color: #1d4ed8;
    border-color: #dbeafe;
  ` : css`
    background-color: #f0fdf4;
    color: #15803d;
    border-color: #dcfce7;
  `}
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid;
  
  ${props => props.$status === '완료' ? css`
    background-color: #f0fdf4;
    color: #16a34a;
    border-color: #bbf7d0;
  ` : css`
    background-color: #fff7ed;
    color: #ea580c;
    border-color: #fed7aa;
  `}
`;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: #9ca3af;
`;
