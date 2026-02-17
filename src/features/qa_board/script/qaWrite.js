import {useState} from "react";
import {postQuest} from '../api/qaService';
import { useNavigate } from "react-router-dom";

export default function useQAQuest(title, detail){
    const [qaResponse, setQaResponse] = useState(null);
    const navigate = useNavigate();

    const postQAQuest = async () => {
        try{
            const res = await postQuest(title, detail)
            setQaResponse(res.data);
            navigate("/qna");
        } catch (err) {
            console.error('QA 업로드 실패', err);
        }
    };

    return{
        qaResponse,
        postQAQuest
    };
}