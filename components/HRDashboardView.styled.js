import styled from 'styled-components';

export const DashboardContainer = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  position: relative;
`;

export const InnerContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
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

export const ContentSection = styled.div`
  padding: 0.5rem 2rem 2rem 2rem; // p-8 pt-2
`;
