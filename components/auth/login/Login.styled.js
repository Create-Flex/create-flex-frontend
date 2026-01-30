import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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
  backdrop-filter: blur(2px);
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 28rem; /* max-w-md */
  padding: 2rem; /* p-8 */
  background-color: rgba(255, 255, 255, 0.95); /* bg-white/95 */
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  border: 1px solid rgba(255, 255, 255, 0.5); /* border-white/50 */
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem; /* mb-10 */
`;

export const LogoBox = styled.div`
  width: 3rem; /* w-12 */
  height: 3rem; /* h-12 */
  background-color: black;
  color: white;
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem; /* rounded-xl */
  margin-bottom: 1rem; /* mb-4 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-md */
`;

export const Title = styled.h1`
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold;
  color: #1f2937; /* text-gray-800 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

export const SubTitle = styled.p`
  color: #6b7280; /* text-gray-500 */
  font-size: 0.875rem; /* text-sm */
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* space-y-5 (approx) */
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  color: #4b5563; /* text-gray-600 */
  margin-bottom: 0.375rem; /* mb-1.5 */
  text-transform: uppercase;
  letter-spacing: 0.025em; /* tracking-wide */
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem; /* px-4 py-3 */
  font-size: 0.875rem; /* text-sm */
  background-color: rgba(249, 250, 251, 0.5); /* bg-gray-50/50 */
  border: 1px solid #e5e7eb; /* border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  transition: all 0.2s;
  
  &::placeholder {
    color: #9ca3af; /* placeholder:text-gray-400 */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px black; /* ring-2 ring-black */
    border-color: transparent;
  }
`;

export const ErrorBox = styled.div`
  padding: 0.75rem; /* p-3 */
  background-color: #fef2f2; /* bg-red-50 */
  border: 1px solid #fee2e2; /* border-red-100 */
  border-radius: 0.5rem; /* rounded-lg */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ErrorText = styled.p`
  color: #ef4444; /* text-red-500 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem; /* py-3 */
  background-color: black;
  color: white;
  font-size: 0.875rem; /* text-sm */
  font-weight: bold;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-md */
  margin-top: 0.5rem; /* mt-2 */
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1f2937; /* hover:bg-gray-800 */
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const Footer = styled.div`
  margin-top: 2rem; /* mt-8 */
  padding-top: 1.5rem; /* pt-6 */
  border-top: 1px solid #f3f4f6; /* border-gray-100 */
  text-align: center;
`;

export const FooterTitle = styled.p`
  font-size: 0.75rem; /* text-xs */
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.5rem; /* mb-2 */
  font-weight: 500;
`;

export const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem; /* gap-4 */
  font-size: 0.75rem; /* text-xs */
  color: #6b7280; /* text-gray-500 */
  flex-wrap: wrap;
`;

export const TestAccountBadge = styled.span`
  padding: 0.25rem 0.5rem; /* px-2 py-1 */
  background-color: #f3f4f6; /* bg-gray-100 */
  border-radius: 0.25rem; /* rounded */
`;
