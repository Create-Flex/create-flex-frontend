import {useState} from "react";
import {postQuest, putQuest} from '../api/qaService';
import { useNavigate } from "react-router-dom";

export default function useQAQuest(title, detail, files){
    const [qaResponse, setQaResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const postQAQuest = async () => {
        const formData = new FormData();
        
        try{
            setLoading(true);
            formData.append("questionTitle", title);
            formData.append("questionDetail", detail);
            if (files.length > 0){
                files.forEach(file => {
                    formData.append("files", file);
                });
            }
            const res = await postQuest(formData)
            const presignedUrl = res.data.uploadURL;
            setQaResponse(res.data);
            for (let i=0; i<files.length; i++){
                await putQuest(files[i], presignedUrl[i]);
            }
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