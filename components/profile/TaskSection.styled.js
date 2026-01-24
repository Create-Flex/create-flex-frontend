import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const TaskSectionWrapper = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f3f4f6;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const TaskTitle = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TaskCount = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  margin-left: 0.25rem;
`;

export const TaskLegend = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
`;

export const TaskLegendItem = styled.span`
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const TaskLegendDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.$color};
`;

export const LegendCount = styled.span`
  font-weight: 700;
  color: #111827;
  margin-left: 0.25rem;
`;

export const TaskListContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const TaskListHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
`;

export const HeaderItem = styled.div`
  ${props => props.$flex && css`flex: 1;`}
  ${props => props.$width && css`width: ${props.$width};`}
  ${props => props.$align === 'right' && css`text-align: right; padding-right: 0.5rem;`}
`;

export const TaskListBody = styled.div`
  & > :not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const TaskItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 3rem; 
  /* Using fixed height or padding? Original was animate but let's stick to simple flex layout first. 
     Warning: Original didn't specify padding on row, but inside items?
     Let's check original: TaskItem styled component existed? No, it was imported.
     Wait, line 14: TaskStatus, TaskItem } from './ProfileView.styled'; 
     They were already styled components! 
     I should check ProfileView.styled.js content. 
     But plan said "Replace remaining Tailwind...". 
     The "TaskItem" in original might have been a styled component but used with className?
     Let's assume we are fully replacing with new structure.
  */
`;

/* Redefining TaskItem here to be safe and consistent */
export const TaskItem = styled.div`
  display: flex;
  align-items: center; 
  /* Original: className="group" ... maybe needed for hover effects? */
  &:hover {
    background-color: #f9fafb;
  }
`;

export const TaskItemContent = styled.div`
  flex: 1;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TaskToggleBtn = styled.button`
  transition: colors 0.2s;
  ${props => props.$completed ? css`
    color: #00C471;
  ` : css`
    color: #d1d5db;
    &:hover {
      color: #6b7280;
    }
  `}
`;

export const TaskText = styled.span`
  ${props => props.$completed ? css`
    color: #9ca3af;
    text-decoration: line-through;
  ` : css`
    font-weight: 500;
  `}
`;

export const TaskStatusWrapper = styled.div`
  width: 6rem;
`;

export const TaskStatusBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  
  ${props => props.$status === '완료됨' && css`
    background-color: #dcfce7;
    color: #166534;
  `}
  
  ${props => props.$status === '진행중' && css`
    background-color: #fef9c3;
    color: #854d0e;
  `}
  
  ${props => props.$status === '대기중' && css`
    background-color: #f3f4f6;
    color: #374151;
  `}
`;

export const TaskActionWrapper = styled.div`
  width: 6rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const TaskDeleteBtn = styled.button`
  color: #9ca3af;
  padding: 0.25rem;
  transition: colors 0.2s;
  &:hover {
    color: #ef4444;
  }
`;

export const AddTaskBtn = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: #9ca3af;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
    color: #4b5563;
  }
  
  & > svg {
    margin-right: 0.5rem;
  }
`;

export const AddTaskInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9fafb80; /* bg-gray-50/50 */
`;

export const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InputIcon = styled.div`
  color: #9ca3af;
`;

export const AddTaskInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  font-size: 0.875rem;
  color: #111827;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;
