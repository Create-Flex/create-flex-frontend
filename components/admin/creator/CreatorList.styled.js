import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; // mb-4
`;

export const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
`;

export const SearchWrapper = styled.div`
  position: relative;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem; // left-3
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; // text-gray-400
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding-left: 2.25rem; // pl-9
  padding-right: 1rem; // pr-4
  padding-top: 0.375rem; // py-1.5
  padding-bottom: 0.375rem;
  font-size: 0.875rem; // text-sm
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.375rem; // rounded-md
  width: 16rem; // w-64
  background-color: rgba(249, 250, 251, 0.5); // bg-gray-50/50
  
  &:focus {
    outline: none;
    border-color: #9ca3af; // focus:border-gray-400
  }
`;

export const Divider = styled.div`
  height: 1rem; // h-4
  width: 1px;
  background-color: #d1d5db; // bg-gray-300
  margin: 0 0.5rem; // mx-2
`;

export const CountText = styled.span`
  font-size: 0.75rem; // text-xs
  color: #6b7280; // text-gray-500
  font-weight: 500;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem; // gap-1
  background-color: #00C471;
  color: white;
  padding: 0.375rem 0.75rem; // px-3 py-1.5
  border-radius: 0.25rem; // rounded
  font-size: 0.875rem; // text-sm
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #00b065;
  }
`;

export const TableWrapper = styled.div`
  border: 1px solid #e5e7eb; // border-gray-200
  border-radius: 0.5rem; // rounded-lg
  overflow: visible;
  background-color: white;
  min-height: 400px;
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb; // bg-gray-50
  border-bottom: 1px solid #e5e7eb; // border-gray-200
`;

export const TableHeader = styled.th`
  padding: 0.75rem 1rem; // px-4 py-3
  font-size: 0.75rem; // text-xs
  font-weight: 600;
  color: #6b7280; // text-gray-500
  text-align: ${props => props.$center ? 'center' : 'left'};
`;

export const TableBody = styled.tbody`
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6; // divide-gray-100
  }
`;

// Dropdown Menu
export const DropdownMenu = styled.div`
  position: absolute;
  right: 2rem; // right-8
  top: 2rem; // top-8
  width: 8rem; // w-32
  background-color: white;
  border-radius: 0.5rem; // rounded-lg
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); // shadow-xl
  border: 1px solid #e5e7eb; // border-gray-200
  padding-top: 0.25rem; // py-1
  padding-bottom: 0.25rem;
  z-index: 50;
  animation: ${fadeIn} 0.1s;
`;

export const MenuButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem; // px-3 py-2
  font-size: 0.75rem; // text-xs
  color: #374151; // text-gray-700
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  
  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
  }
  
  ${props => props.$danger && css`
    color: #dc2626; // text-red-600
    &:hover { background-color: #fef2f2; } // hover:bg-red-50
  `}
`;

export const ActionButton = styled.button`
  color: #9ca3af; // text-gray-400
  padding: 0.25rem; // p-1
  border-radius: 0.25rem; // rounded
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e5e7eb; // hover:bg-gray-200
  }

  ${props => props.$active && css`
    background-color: #e5e7eb; // bg-gray-200
    color: #4b5563; // text-gray-600
  `}
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
  }
`;

export const TableCell = styled.td`
  padding: 1rem; // px-4 py-4
  text-align: ${props => props.$center ? 'center' : 'left'};
  position: ${props => props.$relative ? 'relative' : 'static'};
`;

// Creator Info Components
export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; // gap-3
`;

export const AvatarImg = styled.img`
  width: 2.5rem; // w-10
  height: 2.5rem; // h-10
  border-radius: 9999px; // rounded-full
  object-fit: cover;
  border: 1px solid #f3f4f6; // border-gray-100
`;

export const AvatarCreating = styled.div`
   width: 2.5rem; // w-10
   height: 2.5rem; // h-10
   border-radius: 9999px; // rounded-full
   background-color: #f3f4f6; // bg-gray-100
   border: 1px solid #e5e7eb; // border-gray-200
   display: flex;
   align-items: center;
   justify-content: center;
   color: #9ca3af; // text-gray-400
`;

export const NameText = styled.div`
  font-size: 0.875rem; // text-sm
  font-weight: 700;
  color: #111827; // text-gray-900
`;

export const SubText = styled.div`
  font-size: 0.625rem; // text-[10px]
  color: #9ca3af; // text-gray-400
`;

// Channel Info
export const ChannelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem; // gap-1.5
  margin-bottom: 0.125rem; // mb-0.5
`;

export const ChannelName = styled.span`
  font-size: 0.875rem; // text-sm
  color: #374151; // text-gray-700
`;

export const SubscriberCount = styled.div`
  font-size: 0.6875rem; // text-[11px]
  color: #9ca3af; // text-gray-400
`;

// Status & Helper
export const ContactText = styled.span`
  font-size: 0.75rem; // text-xs
  color: #4b5563; // text-gray-600
  font-weight: 500;
`;

export const NoDataText = styled.span`
  font-size: 0.625rem; // text-[10px]
  color: #9ca3af; // text-gray-400
`;

export const ManagerName = styled.div`
  font-size: 0.875rem; // text-sm
  color: #1f2937; // text-gray-800
`;

export const ConnectedBadge = styled.div`
  font-size: 0.625rem; // text-[10px]
  color: #00C471;
  display: flex;
  align-items: center;
  gap: 0.125rem; // gap-0.5
  margin-top: 0.125rem; // mt-0.5
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  
  ${props => {
        switch (props.$status) {
            case '활동중': return css`color: #00C471;`;
            case '대기중': return css`color: #6b7280;`;
            case '종료': return css`color: #ef4444;`;
            case '휴식중': return css`color: #ca8a04;`; // yellow-600
            default: return css`color: #6b7280;`;
        }
    }}
`;
