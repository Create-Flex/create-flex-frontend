export const API_CONFIG = {
    // BASE_URL: `${VITE_API_URL}/${VITE_API_VERSION}`, localhost:8001/api/v1
    BASE_URL: import.meta.env.VITE_API_URL,
    TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 5000,
    HEADERS: {
        'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
        Accept: 'application/json', //json으로 응답해줘.
    },
};

export const API_ENDPOINTS = {
    //필요한endpoint작성
};
