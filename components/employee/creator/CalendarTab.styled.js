import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem; // mb-4
`;

export const TitleGroup = styled.div``;

export const Title = styled.h2`
  font-size: 1.125rem; // text-lg
  font-weight: 700; // font-bold
  color: #111827; // text-gray-900
`;

export const Subtitle = styled.p`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: black;
  color: white;
  padding: 0.375rem 0.75rem; // px-3 py-1.5
  border-radius: 0.375rem; // rounded-md
  font-size: 0.875rem; // text-sm
  font-weight: 500; // font-medium
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1f2937; // hover:bg-gray-800
  }
  
  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

export const CalendarWrapper = styled.div`
  position: relative;
`;

export const BlurLayer = styled.div`
  ${props => props.$blur && css`
    filter: blur(4px);
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
    transition: all 0.5s;
  `}
`;

export const EmptyStateOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const EmptyStateCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
  max-width: 24rem; // max-w-sm
`;

export const EmptyIconWrapper = styled.div`
  width: 3.5rem; // w-14
  height: 3.5rem; // h-14
  background-color: #f3f4f6; // bg-gray-100
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  color: #9ca3af; // text-gray-400
`;

export const EmptyTitle = styled.h3`
  font-size: 1.125rem; // text-lg
  font-weight: 700; // font-bold
  color: #111827; // text-gray-900
  margin-bottom: 0.5rem;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
  margin-bottom: 1.5rem;
  line-height: 1.625;
`;
