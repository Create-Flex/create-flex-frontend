import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: relative;
`;

export const Header = styled.div`
  padding: 2rem 2rem 1.5rem; /* px-8 pt-8 pb-6 */
  flex-shrink: 0;
  border-bottom: 1px solid #f3f4f6; /* border-gray-100 */
`;

export const HeaderContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const TitleContainer = styled.div``;

export const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SubTitle = styled.p`
  font-size: 0.875rem; /* text-sm */
  color: #6b7280;
  margin-top: 0.5rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: black;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1f2937;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background-color: white;
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

export const CalendarWrapper = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.2s ease-out;
`;

// Modal Styles
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
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 32rem;
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
  background-color: #f9fafb;
`;

export const ModalTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #111827;
  font-size: 1.125rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
`;

export const FormRow = styled.div``;
export const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.6875rem; /* text-[11px] */
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
  letter-spacing: 0.05em;
`;

export const TitleInput = styled.input`
  width: 100%;
  font-size: 1.125rem;
  font-weight: 700;
  border-bottom: 2px solid #f3f4f6;
  padding: 0.25rem 0;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #e5e7eb;
  }
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: black;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  resize: none;

  &:focus {
    outline: none;
    border-color: black;
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

export const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  color: #4b5563;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

export const SaveButton = styled.button`
  padding: 0.625rem 2rem;
  font-size: 0.875rem;
  background-color: black;
  color: white;
  border-radius: 0.75rem;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;
