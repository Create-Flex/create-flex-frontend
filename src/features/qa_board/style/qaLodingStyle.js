import styled, {css, keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const FadeOut = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 암전 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;
  
export const LoadingMark = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #fff;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
