import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ViewContainer = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0; /* padding: 2rem removed to allow full-width header border */
  background-color: white;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  min-height: 100%;
`;

export const ToastContainer = styled.div`
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1f2937;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 50;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ToastMessage = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;
