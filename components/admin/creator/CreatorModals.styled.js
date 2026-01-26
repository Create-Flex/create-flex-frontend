import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Overlay = styled.div`
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

export const Container = styled.div`
  background-color: white;
  border-radius: 0.75rem; // rounded-xl
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); // shadow-2xl
  width: 100%;
  max-width: ${props => props.$maxWidth || '28rem'}; // Default max-w-md
  overflow: hidden;
  border: 1px solid #e5e7eb; // border-gray-200
  animation: ${fadeIn} 0.2s ease-out;
  max-height: 90vh;
  overflow-y: auto;
`;

export const Header = styled.div`
  padding: 1rem 1.5rem; // px-6 py-4
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5); // bg-gray-50/50
`;

export const Title = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const CloseButton = styled.button`
  color: #9ca3af; // text-gray-400
  &:hover { color: #4b5563; } // text-gray-600
`;

export const Body = styled.div`
  padding: 1.5rem; // p-6
  display: flex;
  flex-direction: column;
  gap: 1rem; // space-y-4
`;

export const Footer = styled.div`
  padding: 1rem; // p-4
  background-color: #f9fafb; // bg-gray-50
  border-top: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; // gap-2
`;

export const Button = styled.button`
  padding: 0.5rem 1rem; // px-4 py-2
  font-size: 0.875rem; // text-sm
  border-radius: 0.5rem; // rounded-lg
  transition: all 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  ${props => props.$primary
        ? css`background-color: black; color: white; &:hover { background-color: #1f2937; }`
        : css`color: #4b5563; &:hover { background-color: #e5e7eb; }`
    }
`;

export const SectionTitle = styled.h4`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #111827; // text-gray-900
  text-transform: uppercase;
  letter-spacing: 0.05em; // tracking-wider
  margin-bottom: 0.5rem; // mb-2
  border-bottom: 1px solid #f3f4f6; // border-gray-100
  padding-bottom: 0.5rem; // pb-2
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const InputGroup = styled.div`
  margin-bottom: ${props => props.$mb ? '1rem' : '0'};
`;

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
  transition: colors 0.2s;
  background-color: ${props => props.disabled ? '#f9fafb' : 'white'};
  
  &:focus {
    border-color: black;
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.5rem; // rounded-lg
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.875rem; // text-sm
  outline: none;
  background-color: white;
  transition: colors 0.2s;
  
  &:focus {
    border-color: black;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$cols ? `repeat(${props.$cols}, 1fr)` : '1fr'};
  gap: ${props => props.$gap || '1rem'};
  
  @media (min-width: 768px) {
    grid-template-columns: ${props => props.$mdCols ? `repeat(${props.$mdCols}, 1fr)` : undefined};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$gap || '1rem'};
`;

export const InfoBox = styled.div`
  padding: 0.75rem; // p-3
  background-color: #f9fafb; // bg-gray-50
  border-radius: 0.5rem; // rounded-lg
  border: 1px solid #e5e7eb; // border-gray-200
  color: #6b7280; // text-gray-500
  font-size: 0.625rem; // text-[10px]
  line-height: 1.625;
`;

export const HelperText = styled.div`
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
  margin-bottom: 1rem;
`;

// Creator Modal Specific
export const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem; // gap-2
`;

export const PlatformItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem; // p-3
  border-radius: 0.5rem; // rounded-lg
  border: 1px solid;
  transition: all 0.2s;
  
  ${props => props.$selected
        ? css`border-color: black; background-color: #f9fafb; box-shadow: 0 0 0 1px black;`
        : css`border-color: #e5e7eb; &:hover { border-color: #d1d5db; background-color: #f9fafb; }`
    }
`;

export const PlatformName = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 500;
  margin-top: 0.5rem; // mb-2 in original was margin-bottom for icon?? No, span is below icon
  color: ${props => props.$selected ? 'black' : '#6b7280'};
`;
