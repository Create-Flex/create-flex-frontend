import api, { fileApi } from '../../../api/axios';

export const getQAList = () =>
    api.get('/qna/');

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