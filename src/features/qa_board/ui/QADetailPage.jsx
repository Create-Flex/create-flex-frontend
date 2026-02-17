import useQADetail from '../script/qaDetailScript';
import {Container, InnerContainer, HeaderSection, Title,
    Description, DetailContainer, Question, QuestionTitle,
    QuestionInfo, QuestionMemberName, QuestionDepartmentName,
    QuestionTime, QuestionDetail, Answer, AnswerInfo, AnsweredTitle,
    AnsweredMemberName, AnsweredTime, AnsweredDetail, BackButton,
    NotAnswered, NotAnsweredDetail, AnsweredDepartmentName
} from "../style/qaDetailStyle";
import {CircleQuestionMark} from 'lucide-react';
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function QADetailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const qaId = searchParams.get("qaId");
    const {qaDetail} = useQADetail(qaId);

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
                        <QuestionDepartmentName>{qaDetail.questionDepartmentName}</QuestionDepartmentName>
                        <QuestionTime>) 문의시각:{dayjs(qaDetail.questionTime).format("YYYY-MM-DD HH:mm")}</QuestionTime>
                    </QuestionInfo>
                    <QuestionDetail>{qaDetail.questionDetail}</QuestionDetail>
                </Question>
                {qaDetail.answered ? (
                <Answer>
                    <AnsweredTitle>Reply: {qaDetail.questionTitle} </AnsweredTitle>
                    <AnswerInfo>
                        <AnsweredMemberName>{qaDetail.answerMemberName}(</AnsweredMemberName>
                        <AnsweredDepartmentName>{qaDetail.answerDepartmentName}</AnsweredDepartmentName>
                        <AnsweredTime>) 답변시각:{dayjs(qaDetail.answerTime).format("YYYY-MM-DD HH:mm")}</AnsweredTime>
                    </AnswerInfo>
                    <AnsweredDetail><b>A.</b> {qaDetail.answerDetail}</AnsweredDetail>
                </Answer>
                ) : <NotAnswered onClick={() => navigate(`/qna/answer?qaId=${qaId}`)}>
                        <NotAnsweredDetail>(!) 아직 답변이 등록되지 않았습니다. 클릭해서 답변해주세요.</NotAnsweredDetail>
                    </NotAnswered>}
            </DetailContainer>
            <BackButton onClick={() => navigate(-1)}>뒤로 이동</BackButton>
        </Container>
    );
}

export default QADetailPage;