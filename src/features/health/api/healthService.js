import api, { fileApi } from '../../../api/axios';
import axios from 'axios';

export const getMyHealth = (startDate, endDate) =>
    api.get('/health/my/', {
        params: { startDate, endDate }
    });

export const postMyHealth = (formData) => {
    return fileApi.post("/health/my/upload", formData);
};

export const putMyHealth = async (file, presignedUrl) => {
    return axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type }
    });
};

export const getCreatorHealth = () =>
    api.get('/health/creator/', {
    });

export const saveCreatorMental = (score) => {
    return api.post('/health/creator/upload/mental', null, {
        params: { score }
    })
};

export const getManageHealth = () => {
    return api.get('/health/manage/')
}

export const getManageSearch = (name, startDate, endDate) => {
    return api.get('/health/manage/search', {
        params: { name, startDate, endDate }
    })
}

export const deleteManageHealth = (healthId) => {
    return api.delete(`/health/manage/delete/${healthId}`)
}

export const deleteManageS3 = (presignedUrl) => {
    return axios.delete(presignedUrl);
}

export const analyzeHealthCheckupImage = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fileApi.post('/image/analyze/health-checkup', formData);
};