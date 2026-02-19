import api, { fileApi } from '../../../api/axios';

export const getQAList = () =>
    api.get('/qna/');

export const getQADetail = (qaId) => {
    return api.get('/qna/detail', {
        params: {qaId}
    });
};

export const postQuest = (title, detail) => {
    return api.post("/qna/question", {
        questionTitle: title,
        questionDetail: detail
    });
};

export const postAnswer = (id, detail) => {
    return api.post("/qna/answer", {
        qaId: id,
        answerDetail: detail
    });
};