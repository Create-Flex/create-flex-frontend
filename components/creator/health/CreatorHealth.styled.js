import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: relative;
`;

export const Header = styled.div`
  padding: 2rem 2rem 1.5rem; /* px-8 pt-8 pb-6 */
  flex-shrink: 0;
  border-bottom: 1px solid #f3f4f6; /* border-gray-100 */
`;

export const HeaderContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const TitleContainer = styled.div``;

export const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SubTitle = styled.p`
  font-size: 0.875rem; /* text-sm */
  color: #6b7280;
  margin-top: 0.5rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const SurveyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #00C471;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    background-color: #00b065;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem; /* p-8 */
  background-color: white;
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

export const HealthViewWrapper = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
`;
