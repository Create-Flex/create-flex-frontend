import {useEffect, useState} from "react";
import { getQAList } from "../api/qaService";

export default function useQABoard() {
    const [qaList, setQaList] = useState([]);
    const [totalPage, setTotalPage] = useState();
    const [thisPage, setThisPage] = useState(1);
    
    const fetchQAList = async () => {
        try {
            const res = await getQAList(thisPage);
            setQaList(res.data.content);
            setTotalPage(res.data.totalPages || 1);
        } catch (err) {
            console.error('QA 조회 실패', err);
        }
    };

    useEffect(() => {
        fetchQAList();
    }, [thisPage]);

    return{
        qaList,
        totalPage,
        thisPage,
        setThisPage
    };
}