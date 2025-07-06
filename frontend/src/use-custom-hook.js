import {useCallback, useEffect, useState} from "react";
import axios from "axios";

export const useCustomHook = () => {
    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://open.er-api.com/v6/latest/USD")
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [])

    return {
        data
    }
}

export const useHistory = () => {
    const [data, setData] = useState();
    const [trigger, setTrigger] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            console.log("fetchData")
            try {
                const response = await axios.get("http://localhost:3000/history")
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[trigger])
    
    return {
        data,
        setTrigger
    }
}