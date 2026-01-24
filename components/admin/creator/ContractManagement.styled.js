import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem; // gap-8
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // space-y-6
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
  font-size: 1.125rem; // text-lg
`;

export const SubTitle = styled.p`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
`;

export const AddButton = styled.button`
  font-size: 0.875rem; // text-sm
  background-color: black;
  color: white;
  padding: 0.5rem 1rem; // px-4 py-2
  border-radius: 0.5rem; // rounded-lg
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1f2937; // hover:bg-gray-800
  }
`;

export const ContractList = styled.div`
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid #e5e7eb; // border-gray-200
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
`;

export const ContractCard = styled.div`
  padding: 1.25rem; // p-5
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6; // divide-gray-100 equivalent
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
  }
`;

export const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; // gap-4
`;

export const IconBox = styled.div`
  padding: 0.75rem; // p-3
  border-radius: 0.5rem; // rounded-lg
  background-color: #f9fafb; // bg-gray-50
  color: #9ca3af; // text-gray-400
  transition: all 0.2s;
  border: 1px solid transparent;
  
  ${ContractCard}:hover & {
    background-color: white;
    color: black;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
    border-color: #e5e7eb; // border-gray-200
  }
`;

export const ContractInfo = styled.div``;

export const ContractName = styled.div`
  font-weight: 700;
  color: #111827; // text-gray-900
  font-size: 0.875rem; // text-sm
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  margin-bottom: 0.25rem; // mb-1
`;

export const MetaInfo = styled.div`
  font-size: 0.75rem; // text-xs
  color: #9ca3af; // text-gray-400
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
`;

export const MetaText = styled.span`
  font-weight: 500;
  color: #6b7280; // text-gray-500
`;

export const Dot = styled.span`
  width: 0.25rem; // w-1 h-1
  height: 0.25rem;
  background-color: #d1d5db; // bg-gray-300
  border-radius: 9999px; // rounded-full
`;

export const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  opacity: 0;
  transition: opacity 0.2s;
  
  ${ContractCard}:hover & {
    opacity: 1;
  }
`;

export const DownloadButton = styled.button`
  color: #9ca3af; // text-gray-400
  transition: colors 0.2s;
  padding: 0.5rem; // p-2
  border-radius: 0.5rem; // rounded-lg
  
  &:hover {
    color: black;
    background-color: #f3f4f6; // hover:bg-gray-100
  }
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
  max-width: 28rem; // max-w-md
  overflow: hidden;
  border: 1px solid #e5e7eb; // border-gray-200
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.25rem; // px-5 py-4
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5); // bg-gray-50/50
`;

export const ModalTitle = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const CloseButton = styled.button`
  color: #9ca3af; // text-gray-400
  &:hover { color: #4b5563; } // text-gray-600
`;

export const ModalBody = styled.div`
  padding: 1.5rem; // p-6
  display: flex;
  flex-direction: column;
  gap: 1rem; // space-y-4
`;

export const InputGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #6b7280; // text-gray-500
  margin-bottom: 0.375rem; // mb-1.5
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.5rem; // rounded-lg
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.875rem; // text-sm
  outline: none;
  
  &:focus {
    border-color: black;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem; // gap-4
`;

export const UploadBox = styled.div`
  border: 1px border-dashed #d1d5db; // border-gray-300
  border-style: dashed;
  border-radius: 0.5rem; // rounded-lg
  padding: 1rem; // p-4
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af; // text-gray-400
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
    border-color: #9ca3af; // hover:border-gray-400
  }
`;

export const FileName = styled.span`
  font-size: 0.75rem; // text-xs
`;

export const ModalFooter = styled.div`
  padding: 1rem; // p-4
  background-color: #f9fafb; // bg-gray-50
  border-top: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; // gap-2
`;

export const FooterButton = styled.button`
  padding: 0.5rem 1rem; // px-4 py-2
  font-size: 0.875rem; // text-sm
  border-radius: 0.5rem; // rounded-lg
  transition: colors 0.2s;
  font-weight: 500;
  
  ${props => props.$primary
        ? css`background-color: black; color: white; &:hover { background-color: #1f2937; }` // bg-black hover:bg-gray-800
        : css`color: #4b5563; &:hover { background-color: #e5e7eb; }` // text-gray-600 hover:bg-gray-200
    }
`;
