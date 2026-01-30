import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
  background-color: ${props => props.$bgWhite ? 'white' : 'transparent'};
`;

/* Creator Detail View Styles */
export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem 0.375rem 0.375rem;
  margin-left: -0.375rem;
  border-radius: 0.5rem;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  & > svg {
    transition: transform 0.2s;
  }
  
  &:hover > svg {
    transform: translateX(-2px);
  }
`;

export const BackText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const CoverSection = styled.div`
  position: relative;
  margin-bottom: 3rem;
`;

export const CoverImageWrapper = styled.div`
  height: 12rem;
  width: 100%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EmptyCover = styled.div`
  color: #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmptyCoverText = styled.span`
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

export const AvatarSection = styled.div`
  position: absolute;
  bottom: -2.5rem;
  left: 2rem;
  z-index: 10;
`;

export const AvatarWrapper = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 0.5rem;
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  background-color: white;
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EmptyAvatar = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

export const InfoSection = styled.div`
  padding-left: 9rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const CreatorName = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const DotSeparator = styled.span`
  width: 0.25rem;
  height: 0.25rem;
  background-color: #d1d5db;
  border-radius: 9999px;
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.$active ? '#00C471' : '#6b7280'};
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  width: 100%;
  margin-bottom: 2rem;
`;

export const TaskSection = styled.div`
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

export const LegendItem = styled.span`
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const LegendDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.$color};
`;

export const LegendValue = styled.span`
  font-weight: 700;
  color: #111827;
  margin-left: 0.25rem;
`;

export const TaskList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
`;

export const ListHeaderItem = styled.div`
  ${props => props.$flex && css`flex: 1;`}
  ${props => props.$width && css`width: ${props.$width};`}
`;

export const ListBody = styled.div`
  & > :not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const TaskContent = styled.div`
  flex: 1;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CheckButton = styled.button`
  transition: color 0.2s;
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
  ${props => props.$completed && css`
    color: #9ca3af;
    text-decoration: line-through;
  `}
`;

export const TaskStatus = styled.div`
  width: 6rem;
`;

export const StatusTag = styled.span`
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
  border: 1px solid;
  
  ${props => props.$status === '진행중' ? css`
    background-color: #fef9c3;
    color: #a16207;
    border-color: #fef08a;
  ` : css`
    background-color: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  `}
`;

export const TaskAssignee = styled.div`
  width: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const AssigneeAvatar = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: #fb923c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5625rem;
  font-weight: 700;
`;

export const AssigneeName = styled.span`
  color: #4b5563;
  font-size: 0.75rem;
`;

export const DeleteButton = styled.button`
  color: #9ca3af;
  padding: 0.25rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ef4444;
  }
`;

export const AddTaskRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s;
  
  ${props => props.$isEditing ? css`
    background-color: #f9fafb80;
  ` : css`
    cursor: pointer;
    color: #9ca3af;
    font-size: 0.875rem;
    &:hover {
      background-color: #f9fafb;
      color: #4b5563;
    }
  `}
`;

export const AddTaskInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* Grid View Styles */
export const CreatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const CreatorCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-0.25rem);
  }
`;

export const CardCover = styled.div`
  aspect-ratio: 16 / 9;
  background-color: #f3f4f6;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.2s;
  
  ${CreatorCard}:hover & {
    opacity: 1;
  }
`;

export const CardContent = styled.div`
  padding: 1.25rem;
  position: relative;
`;

export const CardAvatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  border: 4px solid white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: white;
  position: absolute;
  top: -2.5rem;
  left: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

export const CardInfo = styled.div`
  margin-top: 1.5rem;
`;

export const CardName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardSubscribers = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

export const CardStatus = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const CardStatusBadge = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  color: ${props => props.$active ? '#00C471' : '#6b7280'};
`;
