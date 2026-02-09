import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem; // mb-6
`;

export const SearchWrapper = styled.div`
  position: relative;
`;

export const SearchInput = styled.input`
  padding-left: 2.25rem; // pl-9
  padding-right: 1rem; // pr-4
  padding-top: 0.5rem; // py-2
  padding-bottom: 0.5rem;
  font-size: 0.875rem; // text-sm
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  width: 16rem; // w-64
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; // gap-6
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const TeamCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.75rem; // rounded-xl
  padding: 1.25rem; // p-5
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); // hover:shadow-lg
  }
`;

export const TeamCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem; // mb-3
`;

export const IconBox = styled.div`
  padding: 0.5rem; // p-2
  background-color: #eff6ff; // bg-blue-50
  border-radius: 0.5rem; // rounded-lg
  color: #2563eb; // text-blue-600
`;

export const DeleteButton = styled.button`
  padding: 0.5rem; // p-2
  color: #d1d5db; // text-gray-300
  border-radius: 0.5rem; // rounded-lg
  transition: all 0.2s;
  
  &:hover {
    color: #ef4444; // hover:text-red-500
    background-color: #fef2f2; // hover:bg-red-50
  }
`;

export const TeamName = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
  font-size: 1.125rem; // text-lg
  margin-bottom: 0.25rem; // mb-1
`;

export const TeamDescription = styled.p`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
  margin-bottom: 1rem; // mb-4
  height: 2.5rem; // h-10
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const TeamCardFooter = styled.div`
  border-top: 1px solid #f3f4f6; // border-gray-100
  padding-top: 1rem; // pt-4
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MemberCount = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 500;
  color: #6b7280; // text-gray-500
`;

export const AvatarGroup = styled.div`
  display: flex;
  margin-left: -0.5rem; // -space-x-2 equivalent logic needs specific handling or margin on children
  & > div {
    margin-left: -0.5rem; // negative margin for overlap
    &:first-child { margin-left: 0; }
  }
`;

export const AvatarSmall = styled.div`
  width: 1.5rem; // w-6
  height: 1.5rem; // h-6
  border-radius: 9999px; // rounded-full
  border: 1px solid white;
  background-color: #f3f4f6; // bg-gray-100
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 0.5rem; // text-[8px]
  color: #6b7280; // text-gray-500
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarMore = styled(AvatarSmall)`
  background-color: #f9fafb; // bg-gray-50
  font-size: 0.6rem; // text-[9px]
`;

export const AddTeamCard = styled.div`
  border: 1px dashed #d1d5db; // border-gray-300
  border-radius: 0.75rem; // rounded-xl
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  cursor: pointer;
  color: #9ca3af; // text-gray-400
  transition: all 0.2s;
  
  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
    color: #4b5563; // hover:text-gray-600
  }
`;

export const StyledPlusIcon = styled.div`
  margin-bottom: 0.5rem; // mb-2
  display: flex; /* Ensure it is block-like/flex for margin to work on icon if needed, though div is block */
  color: inherit; /* inherit from parent */
`;

export const AddTeamText = styled.span`
  font-size: 0.875rem; // text-sm
  font-weight: 500;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3); // bg-black/30
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; // p-4
  backdrop-filter: blur(4px); // backdrop-blur-sm
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem; // rounded-xl
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); // shadow-2xl
  width: 100%;
  max-width: 56rem; // max-w-4xl
  overflow: hidden;
  border: 1px solid #e5e7eb; // border-gray-200
  display: flex;
  flex-direction: column;
  max-height: 85vh;
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.5rem; // px-6 py-4
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5); // bg-gray-50/50
  flex-shrink: 0;
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  &:hover { color: #4b5563; }
`;

export const ModalBodyGrid = styled.div`
  flex: 1;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const LeftPanel = styled.div`
  padding: 1.5rem; // p-6
  overflow-y: auto;
  border-right: 1px solid #f3f4f6; // border-gray-100
`;

export const RightPanel = styled.div`
  padding: 1.5rem; // p-6
  background-color: rgba(249, 250, 251, 0.3); // bg-gray-50/30
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h4`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #111827; // text-gray-900
  text-transform: uppercase;
  margin-bottom: 1rem; // mb-4
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TeamInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; // space-y-4
  margin-bottom: 2rem; // mb-8
`;

export const FormField = styled.div`
  margin-bottom: ${props => props.$mb ? '1rem' : '0'};
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #6b7280; // text-gray-500
  margin-bottom: 0.375rem; // mb-1.5
`;

export const FormInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.5rem; // rounded-lg
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.875rem; // text-sm
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.5rem; // rounded-lg
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.875rem; // text-sm
  height: 5rem; // h-20
  resize: none;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // space-y-2
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem; // p-2.5
  border-radius: 0.5rem; // rounded-lg
  border: 1px solid #f3f4f6; // border-gray-100
  background-color: #f9fafb; // bg-gray-50
  transition: all 0.2s;
  
  &:hover {
    border-color: #fee2e2; // hover:border-red-100
    background-color: rgba(254, 242, 242, 0.3); // hover:bg-red-50/30
  }
  
  ${props => props.$selectable && css`
    background-color: white;
    border-color: #e5e7eb; // border-gray-200
    cursor: pointer;
    
    &:hover {
      border-color: black;
      background-color: white;
    }
  `}
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; // gap-3
`;

export const MemberAvatar = styled.div`
  width: 2rem; // w-8
  height: 2rem; // h-8
  border-radius: 9999px; // rounded-full
  background-color: white;
  border: 1px solid #e5e7eb; // border-gray-200
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #6b7280;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MemberDetails = styled.div``;

export const MemberName = styled.div`
  font-size: 0.875rem; // text-sm
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const MemberSubText = styled.div`
  font-size: 0.625rem; // text-[10px]
  color: #6b7280; // text-gray-500
`;

export const IconButton = styled.button`
  color: #9ca3af; // text-gray-400
  padding: 0.375rem; // p-1.5
  border-radius: 0.25rem; // rounded
  transition: colors 0.2s;
  
  &:hover {
    color: ${props => props.$delete ? '#ef4444' : 'black'};
    background-color: ${props => props.$delete ? '#fef2f2' : 'transparent'};
  }
  
  ${props => props.$add && css`
    color: #d1d5db; // text-gray-300
    ${MemberItem}:hover & {
        color: black;
    }
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 1.5rem 0; // py-6
  color: #9ca3af; // text-gray-400
  font-size: 0.875rem; // text-sm
  border: 1px dashed #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  
  ${props => props.$py8 && css`padding-top: 2rem; padding-bottom: 2rem;`}
`;

// Tabs
export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb; // border-gray-200
  margin-bottom: 1rem; // mb-4
  background-color: rgba(255, 255, 255, 0.5); // bg-white/50
  border-radius: 0.5rem 0.5rem 0 0; // rounded-t-lg
  padding: 0.5rem 0.5rem 0; // px-2 pt-2
`;

export const TabButton = styled.button`
  flex: 1;
  padding-bottom: 0.5rem; // pb-2
  font-size: 0.875rem; // text-sm
  font-weight: 500;
  transition: colors 0.2s;
  border-bottom: 2px solid transparent;
  
  ${props => props.$active
    ? css`color: black; border-color: black; font-weight: 700;`
    : css`color: #9ca3af; hover:color: #4b5563;`
  }
`;

export const AddMemberSearchWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem; // mb-4
`;

export const MemberListScrollable = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // space-y-2
`;

export const ModalFooter = styled.div`
  padding: 1rem; // p-4
  background-color: #f9fafb; // bg-gray-50
  border-top: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; // gap-2
  flex-shrink: 0;
`;

export const FooterButton = styled.button`
  padding: 0.5rem 1rem; // px-4 py-2
  font-size: 0.875rem; // text-sm
  border-radius: 0.5rem; // rounded-lg
  font-weight: ${props => props.$primary ? '700' : '500'};
  
  ${props => props.$primary
    ? css`
        background-color: black; 
        color: white; 
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: background-color 0.2s;
        &:hover { background-color: #1f2937; }
      `
    : css`
        color: #4b5563; 
        &:hover { background-color: #e5e7eb; }
      `
  }
`;
