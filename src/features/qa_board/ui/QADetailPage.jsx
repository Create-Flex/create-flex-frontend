import useQADetail from '../script/qaDetailScript';
import {Container, DetailContainer, Question, QuestionTitle,
    QuestionInfo, QuestionMemberName, QuestionDepartmentName,
    QuestionTime, QuestionDetail, Answer, AnswerInfo, AnsweredTitle,
    AnsweredMemberName, AnsweredTime, AnsweredDetail, BackButton,
    NotAnswered, NotAnsweredDetail, AnsweredDepartmentName, NotAnsweredNotAdmin
} from "../style/qaDetailStyle";
import QAHeader from './QAHeader';
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { useAuthStore } from '../../../features/auth/model/useAuthStore';
import { UserRole } from '../../../shared/constants/enums';

function QADetailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const qaId = searchParams.get("qaId");
    const {qaDetail} = useQADetail(qaId);
    const { user } = useAuthStore();
    const isAdmin = user?.role === UserRole.ADMINISTRATOR || user?.memberRole === 'ADMINISTRATOR';

    if (!qaDetail) return <div></div>;

    return(
        <Container>
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
                ) : isAdmin ? (<NotAnswered onClick={() => navigate(`/qna/answer?qaId=${qaId}`)}>
                        <NotAnsweredDetail>(!) 아직 답변이 등록되지 않았습니다. 클릭해서 답변해주세요.</NotAnsweredDetail>
                    </NotAnswered>
                ) : (
                    <NotAnsweredNotAdmin>
                        <NotAnsweredDetail>(!) 아직 답변이 등록되지 않았습니다.</NotAnsweredDetail>
                    </NotAnsweredNotAdmin>
                )}
            </DetailContainer>
            <BackButton onClick={() => navigate('/qna')}>뒤로 이동</BackButton>
        </Container>
    );
}

export default QADetailPage;