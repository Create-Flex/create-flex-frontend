import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: ${props => props.$maxWidth || '32rem'};
  margin: 1rem;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #1f2937;
  font-size: 1.125rem;
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 9999px;
  transition: all 0.2s;
  
  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
`;

export const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const PrimaryButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

export const SecondaryButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }
`;

export const ActionButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

/* Specific styles for ImageUploadModal */
export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

export const ImageOptimized = styled.div`
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s;

    &:hover {
        border-color: #3b82f6;
        opacity: 0.9;
    }
`;

export const ImageEl = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const AvatarUploadWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 0;
`;

export const CurrentAvatar = styled.div`
    width: 8rem;
    height: 8rem;
    border-radius: 9999px;
    border: 4px solid #f3f4f6;
    overflow: hidden;
    margin-bottom: 1.5rem;
    background-color: #f9fafb;
`;

export const HelperText = styled.p`
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.75rem;
`;

/* Specific styles for PasswordChangeModal */
export const FormStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

/* Specific styles for HealthResultModal */
export const UploadGuideBox = styled.div`
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
`;

export const GuideIcon = styled.div`
    color: #2563eb;
    margin-top: 0.125rem;
    flex-shrink: 0;
`;

export const GuideContent = styled.div``;

export const GuideTitle = styled.h4`
    font-weight: 700;
    color: #1e40af;
    font-size: 0.875rem;
`;

export const GuideText = styled.p`
    font-size: 0.75rem;
    color: #1d4ed8;
    margin-top: 0.25rem;
    line-height: 1.5;
`;

export const FormStackSpaced = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

export const Select = styled.select`
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: #3b82f6; 
    }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #374151; /* gray-700 */
  margin-bottom: 0.375rem;
  font-weight: 500;
`;

export const UploadArea = styled.div`
    border: 2px dashed #e5e7eb;
    border-radius: 0.75rem;
    padding: 2.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    background-color: white;

    &:hover {
        border-color: #3b82f6;
        background-color: #f9fafb;
    }

    ${props => props.$hasFile && css`
        border-color: #00C471;
        background-color: #f0fdf4;
    `}
`;

export const UploadIconWrapper = styled.div`
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: #9ca3af;

    ${props => props.$hasFile && css`
        background-color: #dcfce7;
        color: #166534;
    `}
`;

export const UploadText = styled.p`
    font-size: 0.875rem;
    font-weight: 700;
    color: #4b5563;
    margin-bottom: 0.25rem;
`;

export const UploadSubText = styled.span`
    font-size: 0.75rem;
    color: #9ca3af;
`;
