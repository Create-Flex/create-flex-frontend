import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  padding: 0; /* padding: 2rem removed */
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #f3f4f6;
  padding: 2rem 2rem 1.5rem 2rem; /* Add padding relative to screen edge */
`;

export const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const SubTitle = styled.p`
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0 2rem 2rem 2rem; /* Add padding for content */
  animation: ${fadeIn} 0.2s ease-out;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const TeamCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-0.25rem);
  }
`;

export const CardBgIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.5rem;
  opacity: 0.1;
  transition: opacity 0.2s;

  ${TeamCard}:hover & {
    opacity: 0.2;
  }
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 10;
`;

export const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: #eff6ff; /* bg-blue-50 */
  color: #2563eb; /* text-blue-600 */
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 1px solid #dbeafe; /* border-blue-100 */
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem; /* text-xl */
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const CardDescription = styled.p`
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 1.5rem;
  height: 2.5rem; /* h-10 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6; /* border-gray-100 */
`;

export const MemberCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563; /* text-gray-600 */
`;

export const CountText = styled.span`
  font-weight: 500;
`;

export const ViewAction = styled.div`
  color: #2563eb; /* text-blue-600 */
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${TeamCard}:hover & {
    opacity: 1;
  }
`;

// Detail View Styles
export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  transition: colors 0.2s;
  padding: 0.375rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  width: fit-content;

  &:hover {
    color: #111827;
    background-color: #f3f4f6;
  }
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 2rem 2rem 0 2rem; /* Add top padding here or manage via Container? Let's add top/side padding */
`;

export const SearchInputWrapper = styled.div`
  position: relative;
`;


export const SearchInput = styled.input`
  padding-left: 2.25rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  background-color: #f9fafb; /* bg-gray-50 */
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  width: 16rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #9ca3af;
    background-color: white;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

export const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0 2rem 2rem 2rem;

  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
  @media (min-width: 1280px) { grid-template-columns: repeat(5, 1fr); }
`;

export const MemberCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-0.25rem);
  }
`;

export const CoverImage = styled.div`
  height: 6rem;
  background-color: #f9fafb;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;

export const CoverPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
`;

export const MemberContent = styled.div`
  padding: 0 1.25rem 1.5rem;
  padding-top: 3.5rem; /* pt-14 */
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AvatarWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  border: 4px solid white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: absolute;
  top: -2.5rem; /* -top-10 */
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  font-size: 1.25rem;
  font-weight: 700;
  color: #9ca3af;
`;

export const MemberName = styled.h3`
  font-size: 1.125rem; /* text-lg */
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

export const MemberRole = styled.p`
  font-size: 0.75rem; /* text-xs */
  color: #6b7280;
  margin-bottom: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.5rem;
  width: 100%;
  text-align: center;
`;

export const BadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
`;

export const Badge = styled.span`
  background-color: #f3f4f6;
  color: #1f2937;
  font-size: 0.75rem; /* text-xs */
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem; /* rounded */
  border: 1px solid #e5e7eb;
  font-weight: 500;
  max-width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusBadge = styled.span`
  font-size: 0.625rem; /* text-[10px] */
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem; /* rounded */
  border: 1px solid;
  
  ${props => {
    if (props.$type === 'active') { // 출근/활동중
      return 'background-color: #f0fdf4; color: #16a34a; border-color: #dcfce7;';
    }
    return 'background-color: #f9fafb; color: #6b7280; border-color: #f3f4f6;';
  }}
`;

export const EmptyState = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #6b7280;
`;

export const EmptyContent = styled.div`
  text-align: center;
`;
