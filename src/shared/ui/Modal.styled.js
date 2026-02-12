import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: ${props => props.$maxWidth || '32rem'};
  overflow: hidden;
  border: 1px solid #e5e7eb;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5);
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #111827;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 9999px;
  transition: all 0.2s;
  
  &:hover {
    color: #4b5563;
    background-color: #e5e7eb;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  max-height: 80vh;
  overflow-y: auto;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 20px;
  }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const PrimaryButton = styled.button`
  background-color: black;
  color: white;
  padding: 0.625rem 2rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export const SecondaryButton = styled.button`
  color: #4b5563;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

export const DangerButton = styled.button`
  color: #ef4444;
  background-color: white;
  border: 1px solid #fee2e2;
  padding: 0.625rem 1.25rem; /* Match PrimaryButton padding roughly or flex-1 logic */
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.2s;
  
  &:hover {
    background-color: #fef2f2;
  }
`;

// Form Elements
export const FormGroup = styled.div`
  margin-bottom: ${props => props.$mb || '0'};
`;

export const Label = styled.label`
  display: block;
  font-size: 0.6875rem; /* 11px */
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
  letter-spacing: 0.05em;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: black;
  }
  
  &::placeholder {
    color: #d1d5db;
  }

  ${props => props.$autoFocus && css`
    font-size: 1.125rem;
    font-weight: 700;
    border-bottom-width: 2px;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding-left: 0;
    border-color: #f3f4f6;
    
    &:focus {
      border-color: #3b82f6;
    }
  `}
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: black;
  }
  
  &::placeholder {
    color: #d1d5db;
  }
`;

export const GuideBox = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.625;
  border: 1px solid #f3f4f6;
  margin-bottom: 1.5rem;
`;
