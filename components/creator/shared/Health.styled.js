import styled, { css, keyframes } from 'styled-components';
import { ModalContent as BaseModalContent } from '../../profile/modals/Modal.styled';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatCardWrapper = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const StatLabel = styled.span`
  color: #9ca3af;
  font-size: 0.6875rem; /* 11px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const IconBox = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: white;
  border: 1px solid #f3f4f6;
`;

export const StatValueGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;

export const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

export const StatUnit = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
`;

export const StatSubLabel = styled.p`
  font-size: 0.625rem; /* 10px */
  color: #9ca3af;
  margin-top: 0.25rem;
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const LeftSection = styled.div`
  @media (min-width: 1024px) {
    grid-column: span 2 / span 2;
  }
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SectionTitleGroup = styled.div``;

export const SectionTitle = styled.h3`
  font-weight: 700;
  color: #111827;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SectionDesc = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const AddButton = styled.button`
  font-size: 0.875rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const TableContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const Th = styled.th`
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
`;

export const Tbody = styled.tbody`
  font-size: 0.875rem;
  
  & > tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const Tr = styled.tr`
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:hover td:first-child {
    color: #2563eb;
  }
`;

export const Td = styled.td`
  padding: 1rem 1.5rem;
  color: #374151;
  
  &:first-child {
    font-weight: 700;
    color: #111827;
    transition: color 0.2s;
  }
  
  &:nth-child(2) {
    color: #4b5563;
  }
`;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
  padding: 2rem 1.5rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
`;

export const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const LogItem = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-left-width: 4px;
  border-left-color: #d1d5db;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    border-color: #d1d5db; /* border-gray-300 */
  }
`;

export const LogStatusBadge = styled.span`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  border: 1px solid;
  
  ${props => props.$status === '확인완료' ? css`
    background-color: #f0fdf4;
    color: #16a34a;
    border-color: #bbf7d0;
  ` : css`
    background-color: #fff7ed;
    color: #ea580c;
    border-color: #fed7aa;
  `}
`;

export const LogHeader = styled.div`
  margin-bottom: 1rem;
`;

export const LogCreator = styled.h4`
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  margin-bottom: 0.125rem;
`;

export const LogDate = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
`;

export const LogCategoryWrapper = styled.div`
  margin-bottom: 0.75rem;
`;

export const LogContent = styled.p`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.625;
  font-weight: 500;
`;

export const EmptyLogs = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px dashed #e5e7eb;
`;

/* PHQ Survey Modal Styles */
export const SurveyModalContent = styled(BaseModalContent)`
  max-width: 42rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

export const StickyHeader = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  border-bottom: 1px solid #f3f4f6;
`;

export const ScrollBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const WelcomeBox = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

export const QuestionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const QuestionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const QuestionText = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

export const OptionButton = styled.button`
  padding: 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid;
  transition: all 0.1s;
  
  ${props => props.$selected ? css`
    background-color: #f0fdf4;
    border-color: #22c55e;
    color: #15803d;
  ` : css`
    background-color: white;
    border-color: #e5e7eb;
    &:hover {
      background-color: #f9fafb;
    }
  `}
`;

export const SubmitWrapper = styled.div`
  padding-top: 1rem;
  text-align: center;
`;

export const ResultBox = styled.div`
  text-align: center;
  padding: 1.5rem 0;
`;

export const ScoreDisplay = styled.div`
  background-color: #f9fafb;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

export const ScoreTotal = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
`;

export const ScoreMax = styled.span`
  font-size: 1.25rem;
  color: #9ca3af;
  font-weight: 400;
`;

export const ResultDescriptionBox = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: left;
  margin-bottom: 2rem;
`;

export const DescriptionHeader = styled.h4`
  font-weight: 700;
  font-size: 0.875rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const DetailHeader = styled(StickyHeader)``;

export const DetailBody = styled(ScrollBody)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const DetailItem = styled.div``;

export const DetailLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 0.25rem;
`;

export const DetailValue = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const ResultBadge = styled.div`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: 1px solid;
  
  ${props => {
    const res = props.$result || '';
    if (res.includes('양호') || res.includes('정상')) return css`background-color: #f0fdf4; color: #15803d; border-color: #bbf7d0;`;
    if (res.includes('주의')) return css`background-color: #fff7ed; color: #c2410c; border-color: #fed7aa;`;
    if (res.includes('위험')) return css`background-color: #fef2f2; color: #b91c1c; border-color: #fecaca;`;
    if (res.includes('재검')) return css`background-color: #faf5ff; color: #7e22ce; border-color: #e9d5ff;`;
    return css`background-color: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;`;
  }}
`;

export const FileAttachmentBox = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
  }
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const FileIconWrapper = styled.div`
  padding: 0.5rem;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 0.25rem;
`;

export const FileMeta = styled.div``;

export const FileName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  transition: color 0.2s;
  
  ${FileAttachmentBox}:hover & {
    color: #2563eb;
  }
`;

export const FileSize = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const DownloadButton = styled.button`
  color: #9ca3af;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #eff6ff;
    color: #2563eb;
  }
`;

export const FootNote = styled.div`
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  background-color: #eff6ff80;
  border-radius: 0.25rem;
  text-align: center;
`;

export const CloseButtonFooter = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
`;

export const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 0.5rem;
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: bg-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

/* Checkup Add Modal Specifics */
export const BlueGuideBox = styled.div`
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const BlueGuideContent = styled.div``;

export const BlueGuideTitle = styled.h4`
  font-weight: 700;
  color: #1e40af;
  font-size: 0.875rem;
`;

export const BlueGuideText = styled.p`
  font-size: 0.75rem;
  color: #1d4ed8;
  margin-top: 0.25rem;
  line-height: 1.5;
`;

export const InputGroup = styled.div``;

export const InputLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
`;

export const StyledSelect = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #111827; 
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

export const UploadArea = styled.div`
    border: 2px dashed #e5e7eb;
    border-radius: 0.75rem;
    padding: 2.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    background-color: white;

    &:hover {
        border-color: #3b82f6;
        background-color: #f9fafb;
    }

    ${props => props.$hasFile && css`
        border-color: #00C471;
        background-color: #f0fdf4;
    `}
`;

export const UploadIconWrapper = styled.div`
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: #9ca3af;

    ${props => props.$hasFile && css`
        background-color: #dcfce7;
        color: #166534;
    `}
`;

export const UploadText = styled.p`
    font-size: 0.875rem;
    font-weight: 700;
    color: #4b5563;
    margin-bottom: 0.25rem;
`;

export const UploadSubText = styled.span`
    font-size: 0.75rem;
    color: #9ca3af;
`;
