import { useCallback, useEffect, useState } from 'react'

import api from '../api/axios';

const UseApi = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(endpoint);

            // console.log("Entire response:", res);
            // console.log("res.data =", res.data);
            // console.log("res.data.data =", res.data.data);
            // console.log("Array?", Array.isArray(res.data.data));
            // console.log("typeof =", typeof res.data.data);

            setData(res.data.data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);


    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    return {
        data, error, loading, refetch: fetchProducts
    }
}

export default UseApi