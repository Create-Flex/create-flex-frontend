import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {opacity: 0;}
    to {opacity: 1;}
`

export const Container = styled.div`
    position: relative;
    padding: 0 1rem 1rem 1rem;
`

export const DetailContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `;

export const Question = styled.div`
  color: #9ca3af;
  background-color: #f1f3f7;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.8rem; // text-[11px]
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  `;

export const QuestionTitle = styled.h3`
  font-size: 1.5rem; // text-xs
  font-weight: 700;
  color: #111827; // text-gray-900
  text-transform: uppercase;
  letter-spacing: 0.05em; // tracking-wider
  margin-bottom: 0.5rem; // mb-2
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px 30px;
  padding-bottom: 0.5rem; // pb-2
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const QuestionInfo = styled.div`
  padding: 0px 24px 0.5rem;
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;
export const QuestionMemberName = styled.p``;
export const QuestionDepartmentName = styled.p``;
export const QuestionTime = styled.p``;

export const QuestionFileList = styled.ul`
  display: flex;
  font-weight: normal;
  text-transform: none;
  font-size: 0.8rem;
  align-items: center; 
  list-style: none;
  padding: 0;
`;

export const QuestionFile = styled.li`
  transition: color 0.2s;

  &:hover {
    color: #4b4e55;
  }
`

export const QuestionDetail = styled.p`
  padding: 12px 24px 24px;
  font-weight: normal;
  text-transform: none;
  font-size: 1rem;
  whiteSpace: pre-line;
  background-color: white;
  color: #4b4e55;
`;
export const Answer = styled.div`
  background-color: #f1f3f7;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.8rem; // text-[11px]
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const AnswerInfo = styled.div`
  display: flex;
  padding: 0px 24px 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const AnsweredTitle = styled.h3`
  font-size: 1.5rem; // text-xs
  font-weight: 700;
  color: #3a3d41;
  letter-spacing: 0.05em; // tracking-wider
  margin-bottom: 0.5rem; // mb-2
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px 30px;
  padding-bottom: 0.5rem; // pb-2
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const AnsweredMemberName = styled.p``;
export const AnsweredTime = styled.p``;
export const AnsweredDepartmentName = styled.p``;
export const AnsweredDetail = styled.p`
  padding: 12px 24px 24px;
  font-weight: normal;
  text-transform: none;
  font-size: 1rem;
  whiteSpace: pre-line;
  background-color: white;
  color: #4b4e55;
`;
export const NotAnswered = styled.div`
  padding: 10px 24px 18px;
  cursor: pointer;
  color: #4b4e55;
  background-color: #e1e1e4;
  transition: background-color 0.2s;

  &:hover {
    color: #7e8086;
    background-color: #ededf1;
  }
`;
export const NotAnsweredNotAdmin = styled.div`
  padding: 10px 24px 18px;
  color: #4b4e55;
  background-color: #e1e1e4;
`;

export const NotAnsweredDetail = styled.p`
  font-weight: normal;
  text-transform: none;
  font-size: 1rem;
  whiteSpace: pre-line;
`;

export const BackButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: black;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1f2937;
  }
`;