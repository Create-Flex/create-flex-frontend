import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {opacity: 0;}
    to {opacity: 1;}
`

export const Container = styled.div`
    position: relative;
    padding: 0 1rem 1rem 1rem;
`;

export const TableContainer = styled.div`
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`

export const QAList = styled.table`
    width: 100%
    text-align: left;
    border-collapse: collapse;
`;

export const QAhead = styled.thead`
    background-color: #f9fafb;
    color: #9ca3af;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const Th = styled.th`
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
`;

export const AnswerBadgeTh = styled.th`
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;

    max-width: 200pt;
`;

export const QAbody = styled.tbody`
    font-size: 0.875rem;

    & > tr:not(:last-child) {
        border-bottom: 1px solid #f3f4f6;
    }
`;

export const Tr = styled.tr`
    transition: background-color 0.2s;
    cursor: pointer;
    
    &:hover {
        background-color: #f9fafb;
    }

    &:hover td:first-child {
        color: #2563eb;
    }
`;

export const Td =styled.td`
    padding: 1rem 1.5rem;
    color: #374151;
    text-align: center;
    
    &:first-child{
        font-weight: 700;
        color: #111827;
        transition: color 0.2s
    }
        
    &:nth-child(2) {
        color: #4b5563;
    }
`;

export const AnswerBadgeTd = styled.td`
    padding: 1rem 1.5rem;
    color: #374151;
    text-align: center;
    
    &:first-child{
        font-weight: 700;
        color: #111827;
        transition: color 0.2s
    }
        
    &:nth-child(2) {
        color: #4b5563;
    }
`

export const AnswerBadge = styled.div`
    font-size: 0.6875rem;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px; // full
    border: 1px solid;
    font-weight: 700;
    width: 100px;

    ${({$result}) => {
        if ($result === true){
            return css`background-color: #f0fdf4; color: #16a34a; border-color: #bbf7d0;`;
        }
        if ($result === false){
            return css`background-color: #fff7ed; color: #ea580c; border-color: #fed7aa;`;
        }
    }}

    return css'';
`;

export const WriteButton = styled.button`
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: black;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem 0;
`;

export const PageButton = styled.button`
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.$active ? '#111827' : '#e5e7eb'};
  background-color: ${props => props.$active ? '#111827' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: #111827;
    background-color: ${props => props.$active ? '#1f2937' : '#f3f4f6'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0.75rem;
`;
