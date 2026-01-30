import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3); /* bg-black/30 */
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* p-4 */
  backdrop-filter: blur(4px); /* backdrop-blur-sm */
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  width: 100%;
  max-width: 32rem; /* max-w-lg */
  overflow: hidden;
  border: 1px solid #e5e7eb; /* border-gray-200 */
  max-height: 90vh;
  overflow-y: auto;
`;

export const Header = styled.div`
  padding: 1rem 1.25rem; /* px-5 py-4 */
  border-bottom: 1px solid #f3f4f6; /* border-gray-100 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5); /* bg-gray-50/50 */
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
`;

export const Title = styled.h3`
  font-weight: bold;
  color: #111827; /* text-gray-900 */
`;

export const CloseButton = styled.button`
  color: #9ca3af; /* text-gray-400 */
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #4b5563; /* hover:text-gray-600 */
  }
`;

export const Body = styled.div`
  padding: 1.5rem; /* p-6 */
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* space-y-5 (approx) */
`;

export const Section = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 0.375rem; /* mb-1.5 */
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
`;

/* Type Grid */
export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem; /* gap-2 */
`;

export const TypeButton = styled.button`
  padding: 0.5rem; /* py-2 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 0.875rem; /* text-sm */
  border: 1px solid;
  transition: all 0.2s;
  background-color: white;
  border-color: ${props => props.$active ? '#000000' : '#e5e7eb'};
  border-width: ${props => props.$active ? '2px' : '1px'};
  color: ${props => props.$active ? '#000000' : '#4b5563'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }
`;

/* Input Fields */
export const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  font-size: 0.875rem; /* text-sm */
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$focusColor || '#3b82f6'}; /* focus:border-blue-500 or black */
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  font-size: 0.875rem; /* text-sm */
  background-color: white;
  resize: none;

  &:focus {
    outline: none;
    border-color: ${props => props.$focusColor || '#3b82f6'};
  }
`;

/* Dynamic Form Sections */
export const FormSection = styled.div`
  padding: 1rem; /* p-4 */
  border-radius: 0.5rem; /* rounded-lg */
  border: 1px solid;
  animation: ${fadeIn} 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  
  background-color: ${props => props.$bgColor};
  border-color: ${props => props.$borderColor};
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem; /* gap-4 */
`;

/* Footer */
export const Footer = styled.div`
  padding: 1rem; /* p-4 */
  background-color: #f9fafb; /* bg-gray-50 */
  border-top: 1px solid #f3f4f6; /* border-gray-100 */
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; /* gap-2 */
  position: sticky;
  bottom: 0;
`;

export const CancelButton = styled.button`
  padding: 0.5rem 1rem; /* px-4 py-2 */
  font-size: 0.875rem; /* text-sm */
  color: #4b5563; /* text-gray-600 */
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 500;
  transition: background-color 0.2s;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb; /* hover:bg-gray-200 */
  }
`;

export const SubmitButton = styled.button`
  padding: 0.5rem 1rem; /* px-4 py-2 */
  font-size: 0.875rem; /* text-sm */
  background-color: black;
  color: white;
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: bold;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1f2937; /* hover:bg-gray-800 */
  }
`;
