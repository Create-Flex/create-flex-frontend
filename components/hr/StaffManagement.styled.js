import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

// Stats Section
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatCardContainer = styled.div`
  background-color: white;
  padding: 1.5rem; // p-6
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid #e5e7eb; // border-gray-200
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const StatLabel = styled.span`
  color: #9ca3af; // text-gray-400
  font-size: 0.6875rem; // text-[11px]
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em; // tracking-wider
`;

export const StatValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem; // mb-1
`;

export const StatValue = styled.span`
  font-size: 1.875rem; // text-3xl
  font-weight: 700;
  color: #111827; // text-gray-900
  line-height: 1.25;
`;

export const StatUnit = styled.span`
  font-size: 0.875rem; // text-sm
  color: #9ca3af; // text-gray-400
  font-weight: 500;
`;

export const StatSubLabel = styled.p`
  font-size: 0.6875rem; // text-[11px]
  color: #9ca3af; // text-gray-400
  margin-top: 0.5rem;
`;

// Controls Section
export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

export const AddButton = styled.button`
  background-color: black;
  color: white;
  font-size: 0.875rem; // text-sm
  font-weight: 500;
  padding: 0.5rem 1rem; // px-4 py-2
  border-radius: 0.5rem; // rounded-lg
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #1f2937; // gray-800
  }
`;

// Table Section
export const TableContainer = styled.div`
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb; // bg-gray-50
  border-bottom: 1px solid #e5e7eb; // border-gray-200
  font-size: 0.75rem; // text-xs
  font-weight: 500;
  color: #6b7280; // text-gray-500
  text-transform: uppercase;
`;

export const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem; // px-6 py-3
  border-right: 1px solid #e5e7eb; // border-gray-200
  text-align: ${props => props.$center ? 'center' : 'left'};

  &:last-child {
    border-right: none;
  }
`;

export const TableBody = styled.tbody`
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6; // divide-gray-100
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;
  &:hover {
    background-color: #f9fafb; // bg-gray-50
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem; // px-6 py-4
  border-right: 1px solid #f3f4f6; // border-gray-100
  text-align: ${props => props.$center ? 'center' : 'left'};
  vertical-align: middle;
  color: ${props => props.$color || 'inherit'};

  &:last-child {
    border-right: none;
  }
`;

export const AvatarWrapper = styled.div`
  width: 2.25rem; // w-9
  height: 2.25rem; // h-9
  border-radius: 9999px; // rounded-full
  background-color: #f3f4f6; // bg-gray-100
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #f3f4f6; // border-gray-100
  font-size: 0.875rem;
  color: #9ca3af;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const NameText = styled.div`
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const IdText = styled.span`
  color: #9ca3af; // text-gray-400
  font-weight: 400;
  font-size: 0.75rem; // text-xs
`;

export const DeptText = styled.div`
  font-size: 0.75rem; // text-xs
  color: #6b7280; // text-gray-500
`;

export const SecondaryText = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem; // gap-1.5
`;

export const StatusDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => {
    switch (props.$status) {
      case '출근': return '#22c55e'; // green-500
      case '퇴근': return '#d1d5db'; // gray-300
      case '병가': return '#ef4444'; // red-500
      case '휴가': return '#3b82f6'; // blue-500
      default: return '#9ca3af';
    }
  }};
`;

export const StatusLabel = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 500;
  color: ${props => {
    switch (props.$status) {
      case '출근': return '#15803d'; // green-700
      case '퇴근': return '#6b7280'; // gray-500
      default: return '#374151';
    }
  }};
`;

export const EditButton = styled.button`
  color: #9ca3af; // text-gray-400
  padding: 0.375rem; // p-1.5
  border-radius: 9999px; // rounded-full
  transition: all 0.2s;

  &:hover {
    color: black;
    background-color: #f3f4f6; // bg-gray-100
  }
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3); // black/30
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 1rem; // rounded-2xl
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); // shadow-2xl
  width: 100%;
  max-width: ${props => props.$maxWidth || '36rem'}; // max-w-xl (36rem) or max-w-md
  overflow: hidden;
  border: 1px solid #e5e7eb; // border-gray-200
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem; // px-6 py-5
  border-bottom: 1px solid ${props => props.$borderColor || '#f3f4f6'}; // border-gray-100
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.$bgColor || 'white'};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem; // text-xl
  font-weight: 700;
  color: ${props => props.$color || '#111827'}; // text-gray-900
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  &:hover {
    color: #4b5563;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem; // p-8
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  padding: 1.5rem 2rem; // px-8 py-6
  background-color: #f9fafb; // bg-gray-50
  border-top: 1px solid #f3f4f6; // border-gray-100
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

// Form Elements
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #6b7280; // text-gray-500
  margin-bottom: 0.375rem; // mb-1.5
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.5rem; // rounded-lg
  padding: 0.5rem 0.75rem; // px-3 py-2
  background-color: white;
  transition: border-color 0.2s;
  color: #9ca3af; // for icons

  &:focus-within {
    border-color: black;
    color: #4b5563;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  font-size: 0.875rem; // text-sm
  outline: none;
  background-color: transparent;
  border: none;
  
  // Basic input style when not in wrapper
  ${props => props.$standalone && css`
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: white;
    
    &:focus {
      border-color: black;
    }
  `}
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const SelectIconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  background-color: white;
  appearance: none;
  
  &:focus {
    border-color: black;
  }
`;

// Buttons
export const PrimaryButton = styled.button`
  padding: 0.625rem 2rem; // px-8 py-2.5
  font-size: 0.875rem; // text-sm
  background-color: ${props => props.$danger ? '#dc2626' : 'black'}; // red-600 or black
  color: white;
  border-radius: 0.75rem; // rounded-xl
  font-weight: 700;
  box-shadow: ${props => props.$danger ? '0 4px 6px -1px rgba(239, 68, 68, 0.2)' : 'none'};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.$danger ? '#b91c1c' : '#1f2937'}; // red-700 or gray-800
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.625rem 1.5rem; // px-6 py-2.5
  font-size: 0.875rem; // text-sm
  color: #6b7280; // text-gray-500
  border-radius: 0.75rem; // rounded-xl
  font-weight: 500;

  &:hover {
    background-color: #f3f4f6; // bg-gray-100
  }
`;

export const ResignationButton = styled.button`
  padding: 0.625rem 1.5rem; // px-6 py-2.5
  font-size: 0.875rem; // text-sm
  background-color: #ef4444; // red-500
  color: white;
  border-radius: 0.75rem; // rounded-xl
  font-weight: 700;
  margin-right: auto; // mr-auto

  &:hover {
    background-color: #dc2626; // red-600
  }
`;

export const ResignationTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.75rem; // rounded-xl
  padding: 0.75rem 1rem; // px-4 py-3
  font-size: 0.875rem; // text-sm
  height: 8rem; // h-32
  resize: none;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #ef4444; // red-500
    box-shadow: 0 0 0 2px #fee2e2; // ring-red-100
  }
`;
