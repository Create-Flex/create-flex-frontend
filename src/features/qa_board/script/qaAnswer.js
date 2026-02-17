import {useState} from "react";
import {postAnswer} from '../api/qaService';
import { useNavigate } from "react-router-dom";

export default function useQAAnswer(id, detail){
    const [qaResponse, setQaResponse] = useState(null);
    const navigate = useNavigate();

    const postQAAnswer = async () => {
        try{
            const res = await postAnswer(id, detail)
            setQaResponse(res.data);
            navigate(`/qna/detail?qaId=${id}`);
        } catch (err) {
            console.error('QA 답변 실패', err);
        }
    };

    return{
        qaResponse,
        postQAAnswer
    };
}