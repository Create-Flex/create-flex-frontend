import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Header = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Align items to bottom to match title/nav baseline if needed, or center */
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
`;

export const DateNavigation = styled.div`
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

export const CurrentDate = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 5rem;
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
    color: #111827;
    background-color: #f9fafb;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const FilterBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  color: #4b5563;
`;

export const FilterClearButton = styled.button`
  margin-left: 0.25rem;
  &:hover {
    color: #111827;
  }
`;

export const OptionsContainer = styled.div`
  position: relative;
`;

export const OptionsButton = styled.button`
  color: #9ca3af;
  padding: 0.375rem;
  border-radius: 0.25rem;
  transition: colors 0.2s;
  background-color: ${props => props.$isOpen ? '#f3f4f6' : 'transparent'};
  color: ${props => props.$isOpen ? '#4b5563' : '#9ca3af'};
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  z-index: 30;
`;

export const DropdownHeader = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const StyledCheck = styled.div`
  color: #3b82f6; /* text-blue-500 */
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #f3f4f6;
  margin: 0.25rem 0;
`;

export const AddEventButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: #2383E2;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

export const CalendarContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
`;

export const CalendarGrid = styled.div`
  width: 100%;
  margin: 0;
  border-left: 1px solid #e5e7eb;
  border-top: 1px solid #e5e7eb;
  background-color: white;
`;

export const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid #e5e7eb;
`;

export const DayHeader = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-right: 1px solid #e5e7eb;
  color: ${props => props.$isSunday ? '#ef4444' : '#9ca3af'};
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid #e5e7eb;
`;

export const DayCell = styled.div`
  min-height: 120px;
  background-color: ${props => props.$isEmpty ? 'rgba(249, 250, 251, 0.1)' : 'white'};
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.25rem;
  position: relative;
  transition: background-color 0.2s;
  cursor: ${props => props.$isEmpty ? 'default' : 'pointer'};
  
  ${props => !props.$isEmpty && css`
    &:hover {
      background-color: rgba(249, 250, 251, 0.5);
    }
  `}
`;

export const DateNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  color: ${props => props.$isToday ? 'white' : '#6b7280'};
  background-color: ${props => props.$isToday ? '#EB5757' : 'transparent'};
`;

export const DateNumberContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
`;

export const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem;
`;

export const EventItem = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;
  overflow: hidden; /* Ensure content stays within */
  
  &:hover {
    filter: brightness(0.95);
  }

  ${props => props.$colorStyle}
`;

export const EventContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  flex: 1; /* Allow expansion to take available space */
  min-width: 0; /* Critical for ellipsis in flex containers */
`;

export const DeleteEventButton = styled.button`
  opacity: 0;
  color: #6b7280;
  margin-left: 0.375rem;
  
  ${EventItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: #ef4444;
  }
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(1px);
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 32rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalHeaderSpacer = styled.div``;

export const CloseModalButton = styled.button`
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 0.25rem;
  
  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TitleInput = styled.input`
  width: 100%;
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  border: none;
  
  &::placeholder {
    color: #d1d5db;
  }
  
  &:focus {
    outline: none;
  }
`;

export const FormRow = styled.div`
  display: flex;
  align-items: ${props => props.$alignStart ? 'flex-start' : 'center'};
`;

export const FormLabel = styled.div`
  width: 6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: ${props => props.$marginTop ? '0.25rem' : '0'};
`;

export const TemplateButtonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const TemplateButton = styled.button`
  padding: 0.125rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
  border: 1px solid transparent;
  
  ${props => props.$active ? css`
    border-color: currentColor;
    ${props.$activeStyle}
  ` : css`
    background-color: #f9fafb;
    color: #6b7280;
    &:hover {
      background-color: #f3f4f6;
    }
  `}
`;

export const DateInput = styled.input`
  font-size: 0.875rem;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  
  &:hover {
    border-color: #d1d5db;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const ContentTextarea = styled.textarea`
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const ModalFooter = styled.div`
  padding: 1rem 2rem;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
`;

export const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2383E2;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  
  &:active {
    transform: scale(0.95);
  }
  
  &:hover {
    background-color: #2563eb;
  }
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
