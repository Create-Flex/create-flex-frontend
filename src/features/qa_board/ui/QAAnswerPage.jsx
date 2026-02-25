import {useState} from "react";
import useQADetail from '../script/qaDetailScript';
import {
    Container, DetailContainer, Question, QuestionTitle, QuestionInfo, QuestionMemberName, QuestionDepartmentName,
    QuestionTime, QuestionDetail, AnswerContainer, AnswerWriteDetail, InputDetail, UploadButton
} from '../style/qaAnswerStyle'
import {FadeOut, LoadingMark} from "../style/qaLodingStyle";
import useQAAnswer from '../script/qaAnswer';
import QAHeader from './QAHeader';
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

function QAAnswerPage() {
    const [searchParams] = useSearchParams();
    const qaId = searchParams.get("qaId");
    const {qaDetail} = useQADetail(qaId);
    const [detail, setDetail] = useState('');
    const {postQAAnswer, loading} = useQAAnswer(qaId, detail);

    if (!qaDetail) return <div></div>;

    return(
        <Container>
            {loading && (
                <FadeOut>
                    <LoadingMark />
                </FadeOut>
            )}
            <QAHeader/>
            <DetailContainer>
                <Question>
                    <QuestionTitle>
                        Q. {qaDetail.questionTitle}
                    </QuestionTitle>
                    <QuestionInfo>
                        <QuestionMemberName>{qaDetail.questionMemberName}(</QuestionMemberName>
                        <QuestionDepartmentName>{qaDetail.questionDepartmentName}</QuestionDepartmentName>
                        <QuestionTime>) 문의시각:{dayjs(qaDetail.questionTime).format("YYYY-MM-DD HH:mm")}</QuestionTime>
                    </QuestionInfo>
                    <QuestionDetail>{qaDetail.questionDetail}</QuestionDetail>
                </Question>
                <AnswerContainer>
                    <AnswerWriteDetail>
                        <InputDetail
                            type="text"
                            placeholder="답변 입력"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                        />
                    </AnswerWriteDetail>
                </AnswerContainer>
            </DetailContainer>
            <UploadButton onClick={postQAAnswer}>업로드</UploadButton>
        </Container>
    );
}

export default QAAnswerPage;