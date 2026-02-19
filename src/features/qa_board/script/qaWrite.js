import {useState} from "react";
import {postQuest} from '../api/qaService';
import { useNavigate } from "react-router-dom";

export default function useQAQuest(title, detail){
    const [qaResponse, setQaResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const postQAQuest = async () => {
        const formData = new FormData();
        
        try{
            setLoading(true);
            formData.append("questionTitle", title);
            formData.append("questionDetail", detail);
            const res = await postQuest(formData)
            setQaResponse(res.data);
            navigate("/qna");
        } catch (err) {
            console.error('QA 업로드 실패', err);
        } finally {
            setLoading(false);
        }
    };

    return{
        qaResponse,
        postQAQuest,
        loading
    };
}