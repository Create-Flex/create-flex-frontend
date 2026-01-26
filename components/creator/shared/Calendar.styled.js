import styled, { css } from 'styled-components';

export const CalendarContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const NavButton = styled.button`
  padding: 0.25rem;
  color: #9ca3af;
  border-radius: 0.25rem;
  transition: all 0.2s;
  
  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
`;

export const Title = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  min-width: 7.5rem;
  text-align: center;
`;

export const TodayButton = styled.button`
  font-size: 0.75rem;
  color: #4b5563;
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  
  &:hover {
    background-color: #f9fafb;
    color: #111827;
  }
`;

export const Legend = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  overflow-x: auto;
  max-width: 500px;
  padding: 0.25rem 0;
  
  /* Hide Scrollbar */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Helper map to convert PALETTE indices to hex values for Styled Components
const COLOR_MAP = [
    { dot: '#4b5563', bg: '#f3f4f6', text: '#111827', border: '#e5e7eb' }, // gray
    { dot: '#00C471', bg: '#f9fafb', text: '#374151', border: '#e5e7eb' }, // green-ish default
    { dot: '#2563eb', bg: '#f3f4f6', text: '#1f2937', border: '#e5e7eb' }, // blue
    { dot: '#9333ea', bg: '#f9fafb', text: '#111827', border: '#e5e7eb' }, // purple
];

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #4b5563;
  flex-shrink: 0;
`;

export const LegendDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => {
        // Map ID to color map index
        const idx = parseInt(props.$id || '0', 10);
        return COLOR_MAP[idx % COLOR_MAP.length].dot;
    }};
`;

export const GridHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
`;

export const DayHeaderCell = styled.div`
  padding: 0.5rem 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.$isSunday ? '#00C471' : '#6b7280'};
`;

export const GridBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const DayCell = styled.div`
  min-height: 120px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.25rem;
  position: relative;
  transition: background-color 0.2s;
  
  ${props => !props.$readOnly && css`
    cursor: pointer;
    &:hover {
      background-color: #f9fafb;
    }
  `}
`;

export const DateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
  padding: 0.25rem;
`;

export const DateNum = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  
  ${props => props.$isToday ? css`
    background-color: #00C471;
    color: white;
  ` : css`
    color: #6b7280;
  `}
`;

export const AddIconWrapper = styled.div`
  opacity: 0;
  color: #00C471;
  padding: 0.125rem;
  transition: opacity 0.2s;
  
  ${DayCell}:hover & {
    opacity: 1;
  }
`;

export const EventList = styled.div`
  padding: 0 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const EventItem = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 1px solid transparent;
  
  &:hover {
    filter: brightness(0.95);
  }

  ${props => {
        // Determine style based on Creator ID
        const idx = parseInt(props.$creatorId || '0', 10);
        const theme = COLOR_MAP[idx % COLOR_MAP.length];
        return css`
      background-color: ${theme.bg};
      color: ${theme.text};
      border-color: ${theme.border};
    `;
    }}
`;

export const EventContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const EventDot = styled.div`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background-color: ${props => {
        const idx = parseInt(props.$creatorId || '0', 10);
        return COLOR_MAP[idx % COLOR_MAP.length].dot;
    }};
`;

export const EventText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
