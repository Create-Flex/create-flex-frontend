import {useState} from "react";
import {postAnswer} from '../api/qaService';
import { useNavigate } from "react-router-dom";

export default function useQAAnswer(id, detail){
    const [qaResponse, setQaResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const postQAAnswer = async () => {
        try{
            setLoading(true);
            const res = await postAnswer(id, detail)
            setQaResponse(res.data);
            navigate(`/qna/detail?qaId=${id}`);
        } catch (err) {
            console.error('QA 답변 실패', err);
        } finally {
            setLoading(false);
        }
    };

    return{
        qaResponse,
        postQAAnswer,
        loading
    };
}