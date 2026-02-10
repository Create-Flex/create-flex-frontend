import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
    animation: ${fadeIn} 0.2s ease-out;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    
    @media (min-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const SupportCard = styled.div`
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

export const IconBox = styled.div`
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
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
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
`;

export const CardDesc = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.125rem;
`;

export const CardContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const SupportList = styled.div`
    margin-bottom: 1.5rem;
`;

export const ListLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
`;

export const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const ListItem = styled.li`
    font-size: 0.875rem;
    color: #4b5563;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:before {
        content: "•";
        color: #d1d5db;
    }
`;

export const ActionButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #111827;
    color: white;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #1f2937;
    }
`;

export const HistorySection = styled.div`
    grid-column: 1 / -1;
    margin-top: 1rem;
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
`;

export const HistoryDesc = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
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
    border-collapse: collapse;
    text-align: left;
`;

export const Thead = styled.thead`
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
`;

export const Th = styled.th`
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: ${props => props.$center ? 'center' : 'left'};
    width: ${props => props.$width || 'auto'};
`;

export const Tbody = styled.tbody`
    & > tr:not(:last-child) {
        border-bottom: 1px solid #f3f4f6;
    }
`;

export const Tr = styled.tr`
    &:hover {
        background-color: #f9fafb;
    }
`;

export const Td = styled.td`
    padding: 1rem;
    font-size: 0.875rem;
    color: #374151;
    text-align: ${props => props.$center ? 'center' : 'left'};
    font-family: ${props => props.$mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit'};
    font-weight: ${props => props.$bold ? '700' : props.$medium ? '500' : '400'};
`;

export const TypeBadge = styled.span`
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    
    ${props => props.$type === 'legal' ? css`
        background-color: #eff6ff;
        color: #2563eb;
    ` : css`
        background-color: #f0fdf4;
        color: #16a34a;
    `}
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    
    ${props => props.$status === '완료' ? css`
        background-color: #f0fdf4;
        color: #16a34a;
    ` : css`
        background-color: #fff7ed;
        color: #c2410c;
    `}
`;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
    padding: 4rem 1rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
`;
