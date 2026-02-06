import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: calc(10% + 50px);
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f3f4f6; /* bg-gray-100 */
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.1); /* bg-black/10 */
  backdrop-filter: blur(0px);
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 34rem;
  padding: 6rem 3rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(1px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
`;

export const LogoBox = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 4rem;
    width: auto;
    object-fit: contain;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

export const SubTitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: bold;
  color: #4b5563;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  font-size: 0.875rem;
  background-color: rgba(249, 250, 251, 0.5);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s;
  
  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px black;
    border-color: transparent;
  }
`;

export const ErrorBox = styled.div`
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: black;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1f2937;
  }

  &:active {
    transform: scale(0.99);
  }
`;
