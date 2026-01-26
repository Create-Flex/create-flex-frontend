import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const SidebarContainer = styled.div`
  width: ${props => props.$isCollapsed ? '80px' : '280px'};
  height: 100vh;
  background-color: #F7F7F5;
  border-right: 1px solid #e5e7eb; /* border-gray-200 */
  display: flex;
  flex-direction: column;
  padding: 1rem; /* p-4 */
  overflow-y: auto;
  flex-shrink: 0;
  transition: all 0.3s ease-in-out;

  /* Custom Scrollbar for "sidebar-scroll" */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db; /* gray-300 */
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'space-between'};
  flex-direction: ${props => props.$isCollapsed ? 'column' : 'row'};
  gap: ${props => props.$isCollapsed ? '1rem' : '0'};
  margin-bottom: ${props => props.$isCollapsed ? '2rem' : '1.5rem'}; /* mb-8 : mb-6 */
  padding-left: 0.25rem; /* px-1 */
  padding-right: 0.25rem;
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  color: #9ca3af; /* text-gray-400 */
`;

export const IconButton = styled.div`
  cursor: pointer;
  &:hover {
    color: #4b5563; /* hover:text-gray-600 */
  }
`;

export const CollapseButton = styled.div`
  color: #9ca3af; /* text-gray-400 */
`;

/* User Profile Section */
export const SectionTitle = styled.h2`
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  color: #1f2937; /* text-gray-800 */
  margin-bottom: 0.75rem; /* mb-3 */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  
  ${props => props.$mt && css`margin-top: 1rem;`} /* mt-4 */
  ${props => props.$px && css`padding-left: 0.5rem; padding-right: 0.5rem;`} /* px-2 */
`;

export const Section = styled.div`
  margin-bottom: 1.5rem; /* mb-6 */
`;

export const UserProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  margin-bottom: 1rem; /* mb-4 */
  cursor: pointer;
  padding: 0.5rem; /* p-2 */
  margin-left: -0.5rem; /* -mx-2 */
  margin-right: -0.5rem;
  border-radius: 0.5rem; /* rounded-lg */
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb; /* hover:bg-gray-200 */
  }
`;

export const UserAvatar = styled.img`
  width: ${props => props.$small ? '2.5rem' : '3rem'}; /* w-10 : w-12 */
  height: ${props => props.$small ? '2.5rem' : '3rem'};
  border-radius: 9999px; /* rounded-full */
  object-fit: cover;
  border: 1px solid #e5e7eb; /* border-gray-200 */
  
  ${UserProfileCard}:hover & {
    border-color: #d1d5db; /* group-hover:border-gray-300 */
  }
`;

export const UserInfo = styled.div``;

export const UserName = styled.div`
  font-weight: bold;
  font-size: 0.875rem; /* text-sm */
  color: #1f2937; /* text-gray-800 */
  
  ${UserProfileCard}:hover & {
    color: black; /* group-hover:text-black */
  }
`;

export const UserRoleText = styled.div`
  font-size: 0.75rem; /* text-xs */
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

export const TagGroup = styled.div`
  display: flex;
  gap: 0.25rem; /* gap-1 */
`;

export const Tag = styled.span`
  font-size: 10px;
  padding: 0.125rem 0.375rem; /* px-1.5 py-0.5 */
  border-radius: 0.25rem; /* rounded */
  
  ${props => props.$active
    ? css`
        background-color: #dcfce7; /* bg-green-100 */
        color: #15803d; /* text-green-700 */
      `
    : css`
        background-color: #e5e7eb; /* bg-gray-200 */
        color: #4b5563; /* text-gray-600 */
      `
  }
`;

/* Action Buttons */
export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem; /* gap-2 */
  margin-bottom: 1.5rem; /* mb-6 */
`;

export const ActionButton = styled.button`
  flex: 1;
  padding-top: 0.375rem; /* py-1.5 */
  padding-bottom: 0.375rem;
  border-radius: 0.25rem; /* rounded */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: colors 0.2s;
  cursor: pointer;

  ${props => props.$variant === 'clockIn' && css`
    border: 1px solid #bfdbfe; /* border-blue-200 */
    background-color: #eff6ff; /* bg-blue-50 */
    color: #2563eb; /* text-blue-600 */
    &:hover { background-color: #dbeafe; /* hover:bg-blue-100 */ }
  `}

  ${props => props.$variant === 'clockOut' && css`
    border: 1px solid #fecaca; /* border-red-200 */
    background-color: #fef2f2; /* bg-red-50 */
    color: #dc2626; /* text-red-600 */
    &:hover { background-color: #fee2e2; /* hover:bg-red-100 */ }
  `}

  ${props => props.$variant === 'default' && css`
    border: 1px solid #e5e7eb; /* border-gray-200 */
    background-color: white;
    color: #374151; /* text-gray-700 */
    &:hover { background-color: #f9fafb; /* hover:bg-gray-50 */ }
  `}
`;

export const CreatorSurveyButton = styled.button`
  width: 100%;
  padding: 0.625rem; /* py-2.5 */
  background-color: #00C471;
  color: white;
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 0.875rem; /* text-sm */
  font-weight: bold;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* gap-2 */
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #00b065;
  }
`;

export const SurveyText = styled.p`
  font-size: 0.625rem; /* text-[10px] */
  color: #9ca3af; /* text-gray-400 */
  text-align: center;
  margin-top: 0.5rem; /* mt-2 */
`;

/* Attendance Info */
export const AttendanceInfoContainer = styled.div`
  margin-bottom: 0.5rem; /* mb-2 */
`;

export const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem; /* mb-1 */
`;

export const InfoTitle = styled.span`
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  color: #374151; /* text-gray-700 */
`;

export const TimerDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem; /* gap-1 */
  margin-bottom: 0.5rem; /* mb-2 */
`;

export const TimerText = styled.span`
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold;
  font-family: monospace; /* font-mono */
  color: ${props => props.$active ? '#2563eb' : '#1f2937'}; /* text-blue-600 : text-gray-800 */
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.375rem; /* h-1.5 */
  background-color: #e5e7eb; /* bg-gray-200 */
  border-radius: 9999px; /* rounded-full */
  overflow: hidden;
  margin-bottom: 0.5rem; /* mb-2 */
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #22c55e; /* bg-green-500 */
  transition: width 1s ease-out;
  width: ${props => props.$width}%;
`;

export const AttendanceTimes = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem; /* text-xs */
`;

export const TimeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
`;

export const TimeLabel = styled.span`
  color: #9ca3af; /* text-gray-400 */
`;

export const TimeValue = styled.span`
  ${props => props.$variant === 'late' && css`color: #ef4444; font-weight: bold;`}
  ${props => props.$variant === 'early' && css`color: #ef4444; font-weight: bold;`}
  ${props => props.$variant === 'normal' && css`color: #2563eb; font-weight: bold;`}
  ${props => props.$variant === 'empty' && css`color: #d1d5db;`}
`;

/* Navigation */
export const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.125rem; /* space-y-0.5 */
  
  ${props => props.$animate && css`
    animation: ${fadeIn} 0.2s ease-out;
  `}
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  padding: 0.375rem 0.5rem; /* py-1.5 px-2 */
  border-radius: 0.25rem; /* rounded */
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  
  ${props => props.$isActive
    ? css`
        background-color: #e5e7eb; /* bg-gray-200 */
        color: #111827; /* text-gray-900 */
        font-weight: 500;
      `
    : css`
        color: #4b5563; /* text-gray-600 */
        &:hover {
          background-color: #f3f4f6; /* hover:bg-gray-100 */
        }
      `
  }
  
  ${props => props.$center && css`
    justify-content: center;
  `}
`;

export const NavText = styled.span`
  font-size: 0.875rem; /* text-sm */
`;

export const Badge = styled.span`
  position: absolute;
  right: ${props => props.$isCollapsed ? '0.25rem' : '0.5rem'};
  top: ${props => props.$isCollapsed ? '0.25rem' : 'auto'};
  background-color: #ef4444; /* bg-red-500 */
  color: white;
  font-size: 9px;
  font-weight: bold;
  padding: 0.125rem 0.375rem; /* px-1.5 py-0.5 */
  border-radius: 9999px; /* rounded-full */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
  margin-bottom: 0.5rem; /* mb-2 */
  margin-top: 1.5rem; /* mt-6 */
  padding-left: 0.25rem; /* px-1 */
  cursor: pointer;
  
  ${props => props.$center && css`justify-content: center;`}

  &:hover div {
    color: #4b5563; /* group-hover:text-gray-600 */
  }
`;

export const AccordionIcon = styled.div`
  color: #9ca3af; /* text-gray-400 */
  transition: color 0.2s;
`;

export const AccordionTitle = styled.div`
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  color: #1f2937; /* text-gray-800 */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
`;

/* Calendar Widget */
export const CalendarWrapper = styled.div`
  background-color: white;
  padding: 0.75rem; /* p-3 */
  border-radius: 0.75rem; /* rounded-xl */
  border: 1px solid #e5e7eb; /* border-gray-200 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db; /* hover:border-gray-300 */
  }
`;

export const CalendarContainer = styled.div`
  cursor: pointer;
`;

export const CalendarNav = styled.div`
  display: flex;
  gap: 0.5rem; /* gap-2 */
`;

export const CalendarNavButton = styled.span`
  font-size: 0.75rem; /* text-xs */
  color: #9ca3af; /* text-gray-400 */
  cursor: pointer;
  padding: 0.25rem; /* p-1 */
  
  &:hover {
    color: black;
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; /* mb-4 */
  padding-left: 0.25rem; /* px-1 */
  padding-right: 0.25rem;
`;

export const CalendarTitle = styled.span`
  font-size: 0.75rem; /* text-xs */
  font-weight: 600;
  color: #374151; /* text-gray-700 */
`;

export const CalendarKey = styled.span`
    ${props => props.$isToday ? css`
        background-color: #EB5757;
        color: white;
    ` : css`
        color: #6b7280; /* text-gray-500 */
        &:hover { background-color: #f3f4f6; }
    `}
    border-radius: 4px;
    width: 1.5rem; /* w-6 */
    height: 1.5rem; /* h-6 */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 11px;
    transition: background-color 0.2s;
`;

export const CalendarDaysHeader = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 0.5rem; /* gap-y-2 */
    text-align: center;
    font-size: 10px;
    color: #9ca3af; /* text-gray-400 */
    margin-bottom: 0.5rem; /* mb-2 */
`;

export const CalendarDayLabel = styled.span`
  ${props => props.$red ? css`color: #f87171;` : ''} /* text-red-400 */
`;

export const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 0.25rem; /* gap-y-1 */
    text-align: center;
`;

export const MainContent = styled.div`
  flex: 1;
  padding-bottom: 2.5rem; /* pb-10 */
`;

export const CalendarWidgetWrapper = styled.div`
  margin-top: 1.5rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  cursor: pointer;
`;
