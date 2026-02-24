import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const BoardContainer = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
`;

export const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const BoardTitle = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BoardCount = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
`;

export const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  min-height: 300px;
`;

export const Column = styled.div`
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
`;

export const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

export const ColumnDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.$color || '#9ca3af'};
`;

export const ColumnCount = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
`;

export const DropZone = styled.div`
  flex: 1;
  padding: 0.5rem;
  min-height: 200px;
  transition: background-color 0.2s;

  ${props => props.$isDraggingOver && css`
    background-color: #eff6ff;
  `}
`;

export const TodoCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: grab;
  transition: box-shadow 0.2s, border-color 0.2s;

  ${props => props.$isDragging && css`
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #93c5fd;
  `}

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
`;

export const TodoContent = styled.div`
  font-size: 0.875rem;
  color: #1f2937;
  word-break: break-word;
  line-height: 1.4;
`;

export const TodoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const TodoAuthor = styled.span`
  color: #6b7280;
`;

export const TodoActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.15s;

  ${TodoCard}:hover & {
    opacity: 1;
  }
`;

export const ActionButton = styled.button`
  padding: 0.125rem;
  color: #9ca3af;
  border-radius: 0.25rem;
  transition: color 0.15s, background-color 0.15s;

  &:hover {
    color: ${props => props.$danger ? '#ef4444' : '#374151'};
    background-color: ${props => props.$danger ? '#fef2f2' : '#f3f4f6'};
  }
`;

export const AddTodoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: #9ca3af;
  border-radius: 0.375rem;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: #f3f4f6;
    color: #4b5563;
  }
`;

export const AddTodoInput = styled.div`
  background-color: white;
  border: 1px solid #93c5fd;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
`;

export const AddTodoTextarea = styled.textarea`
  width: 100%;
  border: none;
  font-size: 0.875rem;
  color: #1f2937;
  resize: none;
  outline: none;
  font-family: inherit;
  line-height: 1.4;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const AddTodoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const AddConfirmButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.15s;

  ${props => props.$primary ? css`
    background-color: #111827;
    color: white;
    &:hover { background-color: #374151; }
  ` : css`
    color: #6b7280;
    &:hover { background-color: #f3f4f6; }
  `}
`;

export const EditInput = styled.textarea`
  width: 100%;
  border: 1px solid #93c5fd;
  border-radius: 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  resize: none;
  outline: none;
  font-family: inherit;
  line-height: 1.4;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6b7280;
  font-size: 0.875rem;
`;
