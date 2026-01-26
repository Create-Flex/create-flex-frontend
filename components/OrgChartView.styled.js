import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  padding: 2rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const SubTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
  background-color: #f9fafb;
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
  display: flex;
  align-items: center;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: black;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    background-color: #1f2937;
  }
`;

export const DeptGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  animation: ${fadeIn} 0.2s ease-out;

  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1280px) { grid-template-columns: repeat(4, 1fr); }
`;

export const DeptCard = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-0.25rem);
  }
`;

export const DeptColorBar = styled.div`
  height: 0.5rem;
  width: 100%;
`;

export const DeptContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const DeptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const DeptIcon = styled.div`
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  color: #374151;
  transition: background-color 0.2s;

  ${DeptCard}:hover & {
    background-color: #f3f4f6;
  }
`;

export const DeptMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const MemberBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4b5563;
`;

export const EditButton = styled.button`
  padding: 0.25rem;
  color: #9ca3af;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    color: #2563eb;
    background-color: #eff6ff;
  }
`;

export const DeptName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const DeptDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex: 1;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const DeptFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DeptPhone = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  
  span {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: ${props => props.$maxWidth || '42rem'};
  border: 1px solid #e5e7eb;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const CloseButton = styled.button`
  padding: 0.5rem;
  color: #9ca3af;
  border-radius: 9999px;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
    color: #4b5563;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

// List Styles
export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MemberNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.125rem;
`;

export const MemberName = styled.span`
  font-weight: 700;
  color: #111827;
`;

export const MemberEngName = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const MemberRole = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  
  ${props => {
        switch (props.$status) {
            case '출근': return css`background-color: #f0fdf4; color: #15803d;`;
            case '퇴근': return css`background-color: #f3f4f6; color: #6b7280;`;
            case '휴가': return css`background-color: #eff6ff; color: #1d4ed8;`;
            case '병가': return css`background-color: #fef2f2; color: #b91c1c;`;
            default: return css`background-color: #f3f4f6; color: #6b7280;`;
        }
    }}
`;

export const EmptyState = styled.div`
  height: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 0.5rem;
  
  p { font-size: 0.875rem; }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fee2e2;
  }
`;

// Form Styles
export const FormContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormField = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 0.375rem;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  height: 5rem;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ColorButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 2px solid;
  transition: all 0.2s;
  
  ${props => props.$isSelected ? css`
    border-color: black;
    transform: scale(1.1);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  ` : css`
    border-color: transparent;
    opacity: 0.7;
    &:hover { opacity: 1; }
  `}
`;

export const FooterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: ${props => props.$primary ? '700' : '500'};
  transition: background-color 0.2s;
  
  ${props => props.$primary ? css`
    background-color: black;
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    &:hover { background-color: #1f2937; }
  ` : css`
    color: #4b5563;
    &:hover { background-color: #f3f4f6; }
  `}
`;
