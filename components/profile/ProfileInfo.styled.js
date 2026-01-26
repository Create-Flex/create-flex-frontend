import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SubSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 2rem;
  margin-top: 3rem;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: ${props => props.$alignStart ? 'flex-start' : 'center'};
`;

export const InfoIconWrapper = styled.div`
  width: 1.5rem;
  color: #9ca3af;
  margin-right: 1rem;
  margin-top: ${props => props.$marginTop ? '0.125rem' : '0'};
`;

export const InfoLabel = styled.div`
  width: 4rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  ${props => props.$wide && css`width: 8rem;`}
  ${props => props.$paddingTop && css`padding-top: 0.25rem;`}
`;

export const InfoValue = styled.div`
  flex: 1;
  font-size: 0.875rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const InfoText = styled.div`
  flex: 1;
  font-size: 0.875rem;
  color: #1f2937;
`;

export const InfoTextBold = styled.span`
  font-weight: 700;
`;

export const InfoTextMedium = styled.span`
  font-weight: 500;
`;

export const SubLabel = styled.span`
  color: #9ca3af;
  margin-right: 0.5rem;
`;

export const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
`;

export const ContactLabel = styled.span`
  color: #9ca3af;
  display: inline-block;
  width: 5rem;
  flex-shrink: 0;
`;

export const EditButtonGroup = styled.div`
  display: flex;
  flex-col: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const InfoAnimationWrapper = styled.div`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const JoinDateWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ContactInfoWrapper = styled.div`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  animation: ${fadeIn} 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

export const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const EditFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.2s ease-out;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InputGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.625rem;
  color: #6b7280;
  margin-bottom: 0.375rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #dbeafe;
  }
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  transition: colors 0.2s;
  ${props => props.$active ? css`
    color: #2563eb;
    font-weight: 700;
  ` : css`
    color: #9ca3af;
    &:hover {
      color: #4b5563;
    }
  `}
`;

export const PasswordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
  transition: colors 0.2s;
  
  &:hover {
    color: #4b5563;
  }
`;

export const EditActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const Spacer = styled.span`
  margin-left: 0.75rem;
  margin-right: 0.75rem;
`;

export const MarginLeft = styled.span`
  margin-left: 1rem;
`;
