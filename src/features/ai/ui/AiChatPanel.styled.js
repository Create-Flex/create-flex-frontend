import styled, { keyframes } from 'styled-components';

/* ───────── Animations ───────── */
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const pulse = keyframes`
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
`;

/* ───────── Floating Action Button ───────── */
export const Fab = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #191919;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: #2d2d2d;
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.96);
  }
`;

/* ───────── Chat Panel ───────── */
export const Panel = styled.div`
  position: fixed;
  bottom: 92px;
  right: 28px;
  width: 400px;
  height: 560px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(15, 15, 15, 0.05),
              0 3px 6px rgba(15, 15, 15, 0.1),
              0 9px 24px rgba(15, 15, 15, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 999;
  animation: ${slideUp} 0.25s ease-out;
  overflow: hidden;
`;

/* ───────── Header ───────── */
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #191919 0%, #37352f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
`;

export const HeaderTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #37352f;
  letter-spacing: -0.01em;
`;

export const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b9a97;
  transition: all 0.15s;

  &:hover {
    background: #f0f0f0;
    color: #37352f;
  }
`;

/* ───────── Messages Area ───────── */
export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  /* Notion-style scrollbar */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: #d6d6d6;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover { background: #bfbfbf; }
`;

export const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${fadeIn} 0.3s ease;
`;

export const MessageLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $isUser }) => ($isUser ? '#9b9a97' : '#37352f')};
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const MessageBubble = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #37352f;
  background: ${({ $isUser }) => ($isUser ? '#f7f6f3' : 'transparent')};
  padding: ${({ $isUser }) => ($isUser ? '10px 14px' : '2px 0')};
  border-radius: ${({ $isUser }) => ($isUser ? '8px' : '0')};
  word-break: break-word;
  
  /* Markdown Styles */
  & > p {
    margin-bottom: 0.5em;
    &:last-child {
      margin-bottom: 0;
    }
  }

  & > ul, & > ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  & > li {
    margin-bottom: 0.25em;
  }

  & > h1, & > h2, & > h3, & > h4, & > h5, & > h6 {
    margin: 0.75em 0 0.5em;
    font-weight: 600;
    line-height: 1.4;
  }

  & > h1 { font-size: 1.5em; }
  & > h2 { font-size: 1.3em; }
  & > h3 { font-size: 1.1em; }
  
  & > blockquote {
    border-left: 3px solid #e0e0e0;
    margin: 0.5em 0;
    padding-left: 1em;
    color: #787774;
    font-style: italic;
  }

  & > pre {
    background: #f7f6f3;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5em 0;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.9em;
    border: 1px solid #e0e0e0;
  }

  & > code {
    background: #f7f6f3; // rgba(135,131,120,0.15);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.85em;
    color: #eb5757;
  }

  & > pre > code {
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }

  & > table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5em 0;
    font-size: 0.9em;
  }

  & > table th,
  & > table td {
    border: 1px solid #e0e0e0;
    padding: 6px 10px;
    text-align: left;
  }

  & > table th {
    background: #f7f6f3;
    font-weight: 600;
  }

  & > a {
    color: #0b6bcb; // Notion-like blue or adjust as need
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  & > hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 1em 0;
  }
`;

/* ───────── Typing Indicator ───────── */
export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
`;

export const TypingDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b4b4b4;
  animation: ${pulse} 1.4s infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
`;

/* ───────── Welcome ───────── */
export const WelcomeArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  text-align: center;
  color: #9b9a97;
  gap: 12px;
`;

export const WelcomeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f7f6f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 4px;
`;

export const WelcomeTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #37352f;
`;

export const WelcomeDesc = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #9b9a97;
`;

/* ───────── Input Area ───────── */
export const InputArea = styled.div`
  padding: 12px 16px 16px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
`;

export const InputWrapper = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #f7f6f3;
  border-radius: 8px;
  padding: 10px 12px;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:focus-within {
    background: #fff;
    border-color: #e0e0e0;
    box-shadow: 0 0 0 2px rgba(25, 25, 25, 0.06);
  }
`;

export const Input = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #37352f;
  resize: none;
  line-height: 1.5;
  max-height: 100px;
  min-height: 20px;

  &::placeholder {
    color: #b4b4b4;
  }
`;

export const SendButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ disabled }) => (disabled ? '#d6d6d6' : '#191919')};
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
