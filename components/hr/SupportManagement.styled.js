import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem; // mb-6
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem; // gap-2
`;

export const TypeFilterButton = styled.button`
  padding: 0.375rem 0.75rem; // px-3 py-1.5
  border-radius: 9999px; // rounded-full
  font-size: 0.75rem; // text-xs
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s;
  
  ${props => {
        switch (props.$type) {
            case 'all':
                return props.$active
                    ? css`background-color: black; color: white; border-color: black;`
                    : css`background-color: white; color: #6b7280; border-color: #e5e7eb;`;
            case 'legal':
                return props.$active
                    ? css`background-color: #2563eb; color: white; border-color: #2563eb;`
                    : css`background-color: white; color: #6b7280; border-color: #e5e7eb;`;
            case 'tax':
                return props.$active
                    ? css`background-color: #16a34a; color: white; border-color: #16a34a;`
                    : css`background-color: white; color: #6b7280; border-color: #e5e7eb;`;
            default:
                return css``;
        }
    }}
`;

export const StatusFilterButton = styled.button`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  padding: 0.25rem 0.5rem; // px-2 py-1
  color: ${props => props.$active ? 'black' : '#9ca3af'};
`;

export const RequestList = styled.div`
  display: grid;
  gap: 1rem; // gap-4
`;

export const RequestCard = styled.div`
  background-color: white;
  padding: 1.25rem; // p-5
  border-radius: 0.75rem; // rounded-xl
  border: 1px solid #e5e7eb; // border-gray-200
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  display: flex;
  align-items: flex-start;
  gap: 1rem; // gap-4
  transition: all 0.2s;
  
  &:hover {
    border-color: #d1d5db; // border-gray-300
  }
`;

export const IconBox = styled.div`
  padding: 0.75rem; // p-3
  border-radius: 0.5rem; // rounded-lg
  flex-shrink: 0;
  
  ${props => props.$type === 'legal'
        ? css`background-color: #eff6ff; color: #2563eb;` // bg-blue-50 text-blue-600
        : css`background-color: #f0fdf4; color: #16a34a;` // bg-green-50 text-green-600
    }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem; // mb-1
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
`;

export const TypeBadge = styled.span`
  font-size: 0.625rem; // text-[10px]
  font-weight: 700;
  padding: 0.125rem 0.375rem; // px-1.5 py-0.5
  border-radius: 0.25rem; // rounded
  text-transform: uppercase;
  
  ${props => props.$type === 'legal'
        ? css`background-color: #dbeafe; color: #1d4ed8;` // bg-blue-100 text-blue-700
        : css`background-color: #dcfce7; color: #15803d;` // bg-green-100 text-green-700
    }
`;

export const DateText = styled.span`
  font-size: 0.75rem; // text-xs
  color: #9ca3af; // text-gray-400
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
`;

export const CreatorName = styled.span`
  font-size: 0.75rem; // text-xs
  font-weight: 700;
  color: #374151; // text-gray-700
  margin-right: 0.5rem; // mr-2
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem; // text-xs
  padding: 0.25rem 0.5rem; // px-2 py-1
  border-radius: 0.25rem; // rounded
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem; // gap-1
  
  ${props => {
        switch (props.$status) {
            case '접수':
                return css`background-color: #f3f4f6; color: #4b5563;`; // bg-gray-100 text-gray-600
            case '진행중':
                return css`background-color: #fef9c3; color: #a16207;`; // bg-yellow-100 text-yellow-700
            case '완료':
                return css`background-color: #dcfce7; color: #15803d;`; // bg-green-100 text-green-700
            default:
                return css``;
        }
    }}
`;

export const Title = styled.h3`
  font-weight: 700;
  color: #111827; // text-gray-900
  margin-bottom: 0.5rem; // mb-2
`;

export const ContentBox = styled.p`
  font-size: 0.875rem; // text-sm
  color: #4b5563; // text-gray-600
  background-color: #f9fafb; // bg-gray-50
  padding: 0.75rem; // p-3
  border-radius: 0.5rem; // rounded-lg
  border: 1px solid #f3f4f6; // border-gray-100
  white-space: pre-wrap;
`;

export const ActionButtons = styled.div`
  margin-top: 1rem; // mt-4
  display: flex;
  gap: 0.5rem; // gap-2
  justify-content: flex-end;
`;

export const ActionButton = styled.button`
  font-size: 0.75rem; // text-xs
  padding: 0.375rem 0.75rem; // px-3 py-1.5
  border-radius: 0.25rem; // rounded
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem; // gap-1
  
  ${props => props.$primary
        ? css`
        background-color: black; 
        color: white; 
        &:hover { background-color: #1f2937; }
      `
        : css`
        border: 1px solid #d1d5db; 
        color: #374151; 
        &:hover { background-color: #f9fafb; }
      `
    }
`;

export const EmptyState = styled.div`
  padding: 5rem 0; // py-20
  text-align: center;
  color: #9ca3af; // text-gray-400
  background-color: #f9fafb; // bg-gray-50
  border-radius: 0.75rem; // rounded-xl
  border: 1px dashed #e5e7eb; // border-gray-200
`;
