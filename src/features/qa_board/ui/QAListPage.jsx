import useQABoard from "../script/qaListScript";
import {Container, QAList, QAhead, Tr, Th, QAbody, Td, WriteButton,
    AnswerBadge, TableContainer} from "../style/qaListStyle";
import { useSearchParams, useNavigate } from 'react-router-dom';
import QAHeader from "./QAHeader";


function QAListPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const listPage = searchParams.get("page");
    const {qaList} = useQABoard(listPage);
    

    return(
        <Container>
            <QAHeader/>
            <WriteButton onClick={() => navigate('/qna/quest')}>문의하기</WriteButton>
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
                            <Tr key={item.qaId} onClick={() => navigate(`/qna/detail?qaId=${item.qaId}`)}>
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