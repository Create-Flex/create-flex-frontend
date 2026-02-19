import { InnerContainer, HeaderSection, Title, Description } from "../style/qaHeaderStyle";
import {CircleQuestionMark} from 'lucide-react';

export default function QAHeader() {
    return (
        <InnerContainer>
            <HeaderSection>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CircleQuestionMark size={32} />
                    <div className="mb-6">
                        <Title>질의 게시판</Title>
                        <Description>인사팀에 문의사항을 남길 수 있습니다.</Description>
                    </div>
                </div>
            </HeaderSection>
        </InnerContainer>
    );
}