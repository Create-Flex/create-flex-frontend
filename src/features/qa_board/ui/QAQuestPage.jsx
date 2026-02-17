import {useState} from "react";
import { Container, InnerContainer, HeaderSection, Title, Description,
    QuestWriteContainer, QuestWriteTitle, Input, InputDetail, QuestWriteDetail, UploadButton
} from '../style/qaQuestStyle';
import useQAQuest from '../script/qaWrite';
import {CircleQuestionMark} from 'lucide-react';

function QAQuestPage() {
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const { postQAQuest } = useQAQuest(title, detail);


    return(
        <Container>
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
            <QuestWriteContainer>
                <QuestWriteTitle>
                    <Input
                        type="text"
                        placeholder='문의 제목 입력'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </QuestWriteTitle>
                <QuestWriteDetail>
                    <InputDetail
                        type="text"
                        placeholder='한번 등록한 문의는 수정 / 삭제 할 수 없습니다.'
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    />
                </QuestWriteDetail>
            </QuestWriteContainer>
            <UploadButton onClick={postQAQuest}>업로드</UploadButton>
        </Container>
    );
}

export default QAQuestPage;