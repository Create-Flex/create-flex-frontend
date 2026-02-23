import {useState} from "react";
import { Container, QuestWriteContainer, QuestWriteTitle, Input, InputDetail,
    QuestWriteDetail, UploadButton, FileButton, QuestWriteFile, FileList, File
} from '../style/qaQuestStyle';
import {FadeOut, LoadingMark} from "../style/qaLodingStyle";
import useQAQuest from '../script/qaWrite';
import QAHeader from './QAHeader';

function QAQuestPage() {
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [files, setFiles] = useState([]);
    const { postQAQuest, loading} = useQAQuest(title, detail, files);

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
                <QuestWriteFile>
                    <input 
                        type="file"
                        multiple
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const selectedFiles = Array.from(e.target.files);
                            setFiles(prev => [...prev, ...selectedFiles]);
                        }}
                    />
                    <FileButton htmlFor="fileInput">파일첨부</FileButton>
                    <FileList>
                        {files.map((file, index) => (
                            index == 0 ?
                            <File key={index}>
                                {file.name}({(file.size / 1024).toFixed(1)}KB)
                            </File> :
                            <File key={index}>
                                , {file.name}({(file.size / 1024).toFixed(1)}KB)
                            </File>
                        ))}
                    </FileList>
                </QuestWriteFile>
            </QuestWriteContainer>
            <UploadButton onClick={postQAQuest}>업로드</UploadButton>
        </Container>
    );
}

export default QAQuestPage;