import useQABoard from "../script/qaListScript";
import {Container, QAList, QAhead, Tr, Th, QAbody, Td, AnswerBadge} from "../style/qaListStyle";

function QAListPage() {
    const {qaList} = useQABoard();

    return(
        <Container>
            <QAList> = styled.table
                <QAhead> = styled.thead
                    <Tr>
                        <Th>답변상태</Th>
                        <Th>질의제목</Th>
                        <Th>질문자</Th>
                        <Th>부서</Th>
                        <Th>작성일</Th>
                    </Tr>
                </QAhead>
                <QAbody> = styled.tbody
                    {qaList.map((item) => (
                        <Tr key={item.qaId}>
                            <Td>
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
        </Container>
    );
}

export default QAListPage;