import {useEffect, useState} from "react";
import { getQADetail } from "../api/qaService";

export default function useQADetail(qaId){
    const [qaDetail, setQaDetail] = useState(null);

    const fetchQADetail = async (id) => {
        try{
            const res = await getQADetail(id);
            console.log("받아온 결과 : ", res.data);
            setQaDetail(res.data);
        } catch (err) {
            console.error('QA 상세 조회 실패', err);
        }
    };

    useEffect(() => {
        console.log("호출 체크");
        fetchQADetail(qaId);
    }, [qaId]);

    return{
        qaDetail
    };
}