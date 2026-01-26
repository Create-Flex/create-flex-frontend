import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  padding: 2rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const DashboardCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.span`
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const CardValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const CardValue = styled.span`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
`;

export const CardUnit = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
  margin-bottom: 0.375rem; // mb-1.5 alignment
`;

export const CardDescription = styled.p`
  font-size: 0.6875rem; // text-[11px]
  color: #9ca3af;
  margin-top: 0.5rem;
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const ProgressLabel = styled.span`
  color: #6b7280;
`;

export const ProgressValue = styled.span`
  font-weight: 700;
  color: #111827;
`;

export const ProgressBarBg = styled.div`
  width: 100%;
  height: 0.375rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: black;
  width: ${props => props.$width || '0%'};
`;

export const TabsContainer = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 1.5rem;
`;

export const TabButton = styled.button`
  padding-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid transparent;

  ${props => props.$active ? css`
    border-color: black;
    color: black;
  ` : css`
    color: #9ca3af;
    &:hover {
      color: #374151;
    }
    }
  `}
`;

export const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
`;
