const getBaseURL = () => {
    return localStorage.getItem('apiBaseUrl') || 'http://127.0.0.1:8000/api/v1';
};

const createApiClient = () => {
    const baseURL = getBaseURL();

    const fetchClient = async (endpoint, options = {}) => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token ? { Authorization: `Token ${token}` } : {}),
        };

        const response = await fetch(`${baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        const isBlob = options.responseType === 'blob';

        if (!response.ok) {
            if (isBlob) throw new Error('Ошибка при загрузке файла');
            const errorData = await response.json().catch(() => null);
            const error = new Error(errorData?.detail || JSON.stringify(errorData));
            error.data = errorData;
            throw error;
        }

        if (isBlob) return response.blob();

        return response.json();
    };

    return {
        get: (endpoint, options = {}) => fetchClient(endpoint, { method: 'GET', ...options }),
        post: (endpoint, body, method = 'POST') =>
            fetchClient(endpoint, {
                method,
                body: JSON.stringify(body),
            }),
        put: (endpoint, body) =>
            fetchClient(endpoint, {
                method: 'PUT',
                body: JSON.stringify(body),
            }),
        delete: (endpoint, options = {}) =>
            fetchClient(endpoint, { method: 'DELETE', ...options }),
    };
};

export const apiClientLocal = createApiClient();

export const getPatients = (page = 1) => apiClientLocal.get(`/patients/?page=${page}`);
export const getPatient = (id) => apiClientLocal.get(`/patients/${id}/`);
export const editPatient = (patientId, updatedData) =>
    apiClientLocal.put(`/patients/${patientId}/`, updatedData);
export const getNews = (page = 1) => apiClientLocal.get(`/news/?page=${page}`);
export const getNewsUnread = () => apiClientLocal.get(`/news/unread/`);
export const postNewsIsread = (newsId) => apiClientLocal.post(`/news/${newsId}/is-read/`);
export const getPatientsStats = (startDate, endDate) => {
    let url = '/patients/statistics/';
    if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    return apiClientLocal.get(url);
};
export const getPatientsStatsMonth = (startDate, endDate) => {
    let url = '/patients/month-stats/';
    if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    return apiClientLocal.get(url);
};
export const getPatientsRegion = (startDate, endDate) => {
    let url = '/patients/region-stats/';
    if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    return apiClientLocal.get(url);
};

export const getMe = () => apiClientLocal.get(`/auth/users/me/`);
export const getUserStats = () => apiClientLocal.get(`/patients/user-stats/`);
export const getUsers = () => apiClientLocal.get(`/users/`);
export const getMainStats = (region, startDate, endDate) => {
    let url = `/patients/main-stats/`;
    const params = [];

    if (region) params.push(`regions=${encodeURIComponent(region)}`);
    if (startDate) params.push(`start_date=${startDate}`);
    if (endDate) params.push(`end_date=${endDate}`);

    if (params.length > 0) {
        url += `?${params.join("&")}`;
    }

    return apiClientLocal.get(url);
};
