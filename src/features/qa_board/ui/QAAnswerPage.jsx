import {useState} from "react";
import useQADetail from '../script/qaDetailScript';
import {
    Container, InnerContainer, HeaderSection, Title, Description,
    DetailContainer, Question, QuestionTitle, QuestionInfo, QuestionMemberName, QuestionDepartmentName,
    QuestionTime, QuestionDetail, AnswerContainer, AnswerWriteDetail, InputDetail, UploadButton
} from '../style/qaAnswerStyle'
import useQAAnswer from '../script/qaAnswer';
import {CircleQuestionMark} from 'lucide-react';
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

function QAAnswerPage() {
    const [searchParams] = useSearchParams();
    const qaId = searchParams.get("qaId");
    const {qaDetail} = useQADetail(qaId);
    const [detail, setDetail] = useState('');
    const {postQAAnswer} = useQAAnswer(qaId, detail);

    if (!qaDetail) return <div></div>;

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
            <DetailContainer>
                <Question>
                    <QuestionTitle>
                        Q. {qaDetail.questionTitle}
                    </QuestionTitle>
                    <QuestionInfo>
                        <QuestionMemberName>{qaDetail.questionMemberName}(</QuestionMemberName>
                        <QuestionDepartmentName>{qaDetail.QuestionDepartmentName}</QuestionDepartmentName>
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