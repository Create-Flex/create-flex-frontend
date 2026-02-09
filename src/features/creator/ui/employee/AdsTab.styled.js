import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const TitleSection = styled.div``;

export const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
`;

export const SubTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const FilterButton = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s;
  
  ${props => props.$active ? css`
    background-color: black;
    color: white;
    border-color: black;
  ` : css`
    background-color: white;
    color: #6b7280;
    border-color: #e5e7eb;
    
    &:hover {
      border-color: #d1d5db;
    }
  `}
`;

export const AddCampaignButton = styled.button`
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #00C471;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #00b065;
  }
`;

export const GridContainer = styled.div`
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

export const AdCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const AdHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const BrandName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
`;

export const RequestDate = styled.div`
  font-size: 0.625rem; /* 10px */
  color: #9ca3af;
`;

export const CampaignTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  min-height: 3.5rem; /* line-clamp-2 approximation */
  
  /* Line clamp fallback */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
`;

export const AvatarWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CreatorText = styled.div`
  overflow: hidden;
`;

export const CreatorName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SubscriberCount = styled.div`
  font-size: 0.625rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AdDetails = styled.div`
  margin-bottom: 1rem;
  flex: 1;
`;

export const DetailLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const Budget = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00C471;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const Description = styled.div`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #4b5563;
  background-color: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #f3f4f6;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TargetDate = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #2563eb;
  font-weight: 500;
`;

export const ActionFooter = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;
`;

export const PendingActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ActionStatusText = styled.div`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ea580c; /* orange-600 */
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.2s;
  
  ${props => props.$variant === 'reject' && css`
    color: #dc2626;
    border: 1px solid #fecaca;
    background-color: white;
    
    &:hover {
      background-color: #fef2f2;
    }
  `}

  ${props => props.$variant === 'accept' && css`
    color: white;
    background-color: black;
    border: 1px solid black;
    
    &:hover {
      background-color: #1f2937;
    }
  `}
`;

export const StatusBadge = styled.div`
  text-align: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.5rem;
  
  ${props => props.$status === 'accepted' ? css`
    color: #16a34a;
    background-color: #f0fdf4;
  ` : css`
    color: #dc2626;
    background-color: #fef2f2;
  `}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 2px dashed #d1d5db;
  color: #9ca3af;
`;

export const EmptyTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem;
`;
