import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {opacity: 0;}
    to {opacity: 1;}
`

export const Container = styled.div`
    position: relative;
    padding: 0 1rem 1rem 1rem;
`;

export const InnerContainer = styled.div`
  width: 100%;
  padding: 0;
`;

export const HeaderSection = styled.div`
  padding: 2rem 2rem 1.5rem 2rem; // px-8 pt-8 pb-6
  margin-bottom: 2rem;
  border-bottom: 1px solid #f3f4f6; // border-gray-100
`;

export const Title = styled.h1`
  font-size: 1.875rem; // text-3xl
  font-weight: 700;
  color: #111827; // text-gray-900
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  color: #6b7280; // text-gray-500
  font-size: 0.875rem; // text-sm
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
`