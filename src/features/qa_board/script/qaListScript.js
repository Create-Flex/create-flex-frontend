import {useEffect, useState} from "react";
import { getQAList } from "../api/qaService";

export default function useQABoard() {
    const [qaList, setQaList] = useState([]);
    
    const fetchQAList = async () => {
        try {
            const res = await getQAList();
            setQaList(res.data);
        } catch (err) {
            console.error('QA 조회 실패', err);
        }
    };

    useEffect(() => {
        fetchQAList();
    }, []);

    return{
        qaList
    };
}