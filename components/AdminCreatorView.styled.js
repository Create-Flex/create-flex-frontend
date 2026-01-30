import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  padding: 2rem; // p-8
  animation: ${fadeIn} 0.3s ease-out;
`;

export const InnerContainer = styled.div`
  width: 100%;
  padding: 0;
`;

export const Breadcrumb = styled.div`
  font-size: 0.75rem; // text-xs
  color: #6b7280; // text-gray-500
  margin-bottom: 0.5rem; // mb-2
`;

export const HeaderSection = styled.div`
  margin-bottom: 2rem; // mb-8
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  padding-bottom: 1.5rem; // pb-6
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; // gap-3
`;

export const IconBox = styled.div`
  padding: 0.5rem; // p-2
  background-color: #f3f4f6; // bg-gray-100
  border-radius: 0.5rem; // rounded-lg
  color: #4b5563; // text-gray-600
`;

export const Title = styled.h1`
  font-size: 1.875rem; // text-3xl
  font-weight: 700;
  color: #111827; // text-gray-900
  margin-bottom: 0.25rem;
`;

export const Description = styled.p`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
`;
