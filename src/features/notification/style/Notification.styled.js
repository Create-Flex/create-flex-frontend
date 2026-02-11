import styled from 'styled-components';

export const Button = styled.button`
  position: fixed;
  bottom: 92px;
  right: ${props => props.$isChatOpen ? '440px' : '28px'};
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  color: #00C471;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    background-color: #f9fafb;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: rotate(15deg);
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
`;

export const ClearButton = styled.button`
  font-size: 0.75rem;
  margin-right: 12px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  background: white;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    color: #ef4444;
    border-color: #fecaca;
    background: #fef2f2;
  }
`;
