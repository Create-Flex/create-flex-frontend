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

// Helper to generate consistent pastel colors from string ID
const generatePastelColor = (idStr, isManager = false) => {
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Hue: 0-360 based on hash
  const h = Math.abs(hash) % 360;

  // Saturation: Fixed to keep it colorful but not neon
  const s = 70;

  // Lightness: Different for Manager vs Creator
  // Creator: Richer background (85%), Darker text (30%)
  // Manager: Very light "faded" background (95%), Lighter text (45%)
  const bgL = isManager ? 95 : 85;
  const textL = isManager ? 45 : 30;
  const borderL = isManager ? 90 : 80;

  return {
    bg: `hsl(${h}, ${s}%, ${bgL}%)`,
    text: `hsl(${h}, ${s}%, ${textL}%)`,
    border: `hsl(${h}, ${s}%, ${borderL}%)`,
    dot: `hsl(${h}, ${s}%, ${isManager ? 60 : 50}%)` // Dot is slightly darker than bg
  };
};

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
    const idStr = String(props.$id || '0');
    return generatePastelColor(idStr, false).dot;
  }};
`;

export const GridHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
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
  grid-template-columns: repeat(7, minmax(0, 1fr));
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
  width: 100%; /* Ensure list takes full width of cell */
  overflow: hidden; /* Prevent list itself from overflowing */
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
  overflow: hidden; /* Ensure container clips content */
  max-width: 100%; /* Ensure item doesn't exceed list width */
  
  &:hover {
    filter: brightness(0.95);
  }

  ${props => {
    const idStr = String(props.$creatorId || '0');
    const isManager = props.$isManager || false;
    const theme = generatePastelColor(idStr, isManager);

    return css`
      background-color: ${theme.bg};
      color: ${theme.text};
      border-color: ${theme.border};
      ${isManager && css`
        border-style: dashed; /* Optional: adds visual distinction for manager items */
      `}
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
  flex: 1; /* Take available space */
  min-width: 0; /* Enable flex child shrinking */
  max-width: 100%; /* Constraint width */
`;

export const EventDot = styled.div`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background-color: ${props => {
    const idStr = String(props.$creatorId || '0');
    return generatePastelColor(idStr, false).dot;
  }};
`;

export const EventText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1; /* Allow shrinking */
  min-width: 0; /* Enable truncation */
  display: block; /* Ensure text-overflow works by being block-levelish inside flex */
`;
