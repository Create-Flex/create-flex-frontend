import useQABoard from "../script/qaListScript";
import {Container, InnerContainer, HeaderSection, Title,
    Description, QAList, QAhead, Tr, Th, QAbody, Td,
    AnswerBadge, TableContainer} from "../style/qaListStyle";
import {CircleQuestionMark} from 'lucide-react';

function QAListPage() {
    const {qaList} = useQABoard();

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
            <TableContainer>
                <QAList>
                    <QAhead>
                        <Tr>
                            <Th>답변상태</Th>
                            <Th>질의제목</Th>
                            <Th>질문자</Th>
                            <Th>부서</Th>
                            <Th>작성일</Th>
                        </Tr>
                    </QAhead>
                    <QAbody>
                        {qaList.map((item) => (
                            <Tr key={item.qaId}>
                                <Td style={{width : '60px'}}>
                                    <AnswerBadge $result={item.answered}>
                                        {item.answered ? "답변완료" : "미답변"}
                                    </AnswerBadge>
                                </Td>
                                <Td>{item.questionTitle}</Td>
                                <Td>{item.questionMemberName}</Td>
                                <Td>{item.departmentName}</Td>
                                <Td>
                                    {new Date(item.questionTime).toLocaleDateString()}
                                </Td>
                            </Tr>
                        ))}
                    </QAbody>
                </QAList>
            </TableContainer> 
        </Container>
    );
}

export default QAListPage;