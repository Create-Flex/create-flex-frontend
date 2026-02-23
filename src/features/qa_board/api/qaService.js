import api, { fileApi } from '../../../api/axios';
import axios from 'axios';

export const getQAList = (listPage) =>{
    api.get('/qna/', {
        params: {listPage}
    });
};

export const getQADetail = (qaId) => {
    return api.get('/qna/detail', {
        params: {qaId}
    });
};

export const postQuest = (formData) => {
    return fileApi.post("/qna/question", formData);
};

export const postAnswer = (id, detail) => {
    return api.post("/qna/answer", {
        qaId: id,
        answerDetail: detail
    });
};

export const putQuest = async (file, presignedUrl) => {
    return axios.put(presignedUrl, file, {
        headers: {'Content-Type': file.type}
    });
};