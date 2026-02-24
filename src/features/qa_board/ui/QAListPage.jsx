import React, {useState} from 'react';
import useQABoard from "../script/qaListScript";
import {Container, QAList, QAhead, Tr, Th, QAbody, Td, WriteButton,
    AnswerBadge, TableContainer, PaginationContainer,
    PageButton, PageInfo} from "../style/qaListStyle";
import { useNavigate } from 'react-router-dom';
import QAHeader from "./QAHeader";
import {ChevronLeft, ChevronRight} from 'lucide-react';


function QAListPage() {
    const navigate = useNavigate();
    const {qaList,totalPage,thisPage,setThisPage} = useQABoard();
    

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
            <PaginationContainer>
                <PageButton
                    onClick={() => setThisPage(page-1)}
                    disabled={thisPage === 1}
                >
                    <ChevronLeft size={16} />
                </PageButton>

                {Array.from({ length: totalPage }, (_, i) => i + 1)
                    .filter(page => {
                        return page === 1 ||
                               page === totalPage ||
                               Math.abs(page - thisPage) <= 2;
                    })
                    .map((page, index, arr) => (
                        <React.Fragment key={page}>
                            {index > 0 && arr[index - 1] !== page - 1 && (
                                <PageInfo>...</PageInfo>
                            )}
                            <PageButton
                                $active={page === thisPage}
                                onClick={() => setThisPage(page)}
                            >
                                {page}
                            </PageButton>
                        </React.Fragment>
                    ))
                }

                <PageButton
                    onClick={() => setThisPage(page+1)}
                    disabled={thisPage >= totalPage}
                >
                    <ChevronRight size={16} />
                </PageButton>
            </PaginationContainer>
        </Container>
    );
}

export default QAListPage;