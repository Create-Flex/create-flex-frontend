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
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const HeaderButton = styled.button`
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: #4b5563;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: colors 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const BackButtonWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 20;
`;

export const CoverButtonWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`;

export const CoverUpdateBtn = styled.button`
  font-size: 0.75rem;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const CoverImageContainer = styled.div`
  height: 12rem;
  background-color: #f9fafb;
  width: 100%;
  position: relative;
  cursor: pointer;
  
  &:hover .overlay {
    opacity: 1;
  }
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PlaceholderCover = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
`;

export const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const ContentContainer = styled.div`
  padding-left: 3rem;
  padding-right: 3rem;
  padding-bottom: 5rem;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
`;

export const AvatarContainer = styled.div`
  margin-top: -4rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 10;
  display: inline-block;
`;

export const AvatarWrapper = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  border: 4px solid white;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;

  &:hover .overlay {
    opacity: 1;
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const NameSection = styled.div`
  margin-bottom: 2rem;
`;

export const NameTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

export const TabsContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

export const TabsList = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export const TabItem = styled.div`
  padding-bottom: 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: colors 0.2s;
  ${props => props.$active ? css`
    font-weight: 700;
    color: black;
    border-bottom: 2px solid black;
  ` : css`
    color: #6b7280;
    &:hover {
      color: #1f2937;
    }
  `}
`;

export const SectionLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;


// Side Widget
export const SideWidget = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 1024px) {
    width: 320px;
  }
`;

export const VacationWidget = styled.div`
  background-color: #f9f9f9;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #f3f4f6;
`;

export const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const WidgetTitle = styled.h3`
  font-weight: 700;
  font-size: 0.875rem;
  color: #1f2937;
`;

export const SmallButton = styled.button`
  background-color: white;
  border: 1px solid #e5e7eb;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const DaysRemaining = styled.div`
  margin-bottom: 1.5rem;
`;

export const DaysNumber = styled.span`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

export const DaysText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.25rem;
`;

export const UsageBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const UsageItem = styled.div``;

export const UsageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const ProgressBarBg = styled.div`
  width: 100%;
  height: 0.375rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$width || '0%'};
  background-color: ${props => props.$color || '#3b82f6'};
`;



export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
`;
