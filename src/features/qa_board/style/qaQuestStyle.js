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

export const QuestWriteContainer = styled.div`
  color: #9ca3af;
  background-color: #f1f3f7;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8rem; // text-[11px]
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const QuestWriteTitle = styled.h3`
  font-size: 1.5rem; // text-xs
  font-weight: 700;
  color: #111827; // text-gray-900
  text-transform: uppercase;
  letter-spacing: 0.05em; // tracking-wider
  margin-bottom: 0.5rem; // mb-2
  padding: 16px 24px 30px;
  padding-bottom: 0.5rem; // pb-2
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const QuestWriteDetail = styled.p`
  padding: 12px 24px 24px;
  font-weight: normal;
  text-transform: none;
  font-size: 1rem;
  whiteSpace: pre-line;
  background-color: white;
  color: #4b4e55;
`;

export const UploadButton = styled.button`
  margin-top: 0.5rem;
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
`

export const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  border: none;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
  background-color: inherit;
  
  &:focus {
    outline: none;
  }
`;

export const InputDetail = styled.textarea`
  width: 100%;
  min-height: 100pt;
  font-size: 0.875rem;
  border: none;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
  background-color: inherit;
  
  &:focus {
    outline: none;
  }
`;