import api, { fileApi } from '../../../api/axios';

export const getQAList = () =>
    api.get('/qna/');

export const getQADetail = (qaId) => {
    return api.get('/qna/', {
        params: {qaId}
    });
};