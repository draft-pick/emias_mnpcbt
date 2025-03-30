import { useState, useEffect, useRef } from 'react';

const useApiRequest = (apiFunc, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDelayLoading, setIsDelayLoading] = useState(false); // Для задержки анимации загрузки
    const isMounted = useRef(true);

    const fetchData = async () => {
        setLoading(true);
        setIsDelayLoading(true);

        const delay = new Promise((resolve) => setTimeout(resolve, 300));

        try {
            const [response] = await Promise.all([apiFunc(), delay]);
            if (isMounted.current) {
                setData(response);
                setError(null);
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message || 'Неизвестная ошибка');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setIsDelayLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchData();

        return () => {
            isMounted.current = false;
        };
    }, dependencies);

    const refetch = async () => {
        await fetchData();
    };

    return { data, loading: isDelayLoading, error, refetch };
};

export default useApiRequest;