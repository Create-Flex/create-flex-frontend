import {useState} from "react";
import { Container, QuestWriteContainer, QuestWriteTitle, Input, InputDetail, QuestWriteDetail, UploadButton
} from '../style/qaQuestStyle';
import {FadeOut, LoadingMark} from "../style/qaLodingStyle";
import useQAQuest from '../script/qaWrite';
import QAHeader from './QAHeader';

function QAQuestPage() {
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const { postQAQuest, loading} = useQAQuest(title, detail);

    return(
        <Container>
            {loading && (
                <FadeOut>
                    <LoadingMark />
                </FadeOut>
            )}
            <QAHeader/>
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