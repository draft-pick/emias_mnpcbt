import { useNavigate } from 'react-router-dom';

const createApiClient = (baseURL) => {
    const fetchClient = async (endpoint, options = {}) => {
        const token = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token ? { Authorization: `Token ${token}` } : {}),
        };

        let response = await fetch(`${baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        // Если токен недействителен, пробуем обновить токен
        if (response.status === 401 && refreshToken) {
            try {
                const newToken = await refreshAccessToken(refreshToken);
                if (newToken) {
                    localStorage.setItem('authToken', newToken);

                    // Повторяем запрос с новым токеном
                    response = await fetch(`${baseURL}${endpoint}`, {
                        ...options,
                        headers: {
                            ...headers,
                            Authorization: `Token ${newToken}`,
                        },
                    });
                }
            } catch (error) {
                handleSessionExpired(); // Обработка истечения сессии
                throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || `Ошибка API: ${response.status}`);
        }

        return response.json();
    };

    return {
        get: (endpoint) => fetchClient(endpoint, { method: 'GET' }),
        post: (endpoint, body) =>
            fetchClient(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
            }),
        put: (endpoint, body) =>
            fetchClient(endpoint, {
                method: 'PUT',
                body: JSON.stringify(body),
            }),
        delete: (endpoint) =>
            fetchClient(endpoint, { method: 'DELETE' }),
    };
};

// Функция для обновления токена через Djoser
const refreshAccessToken = async (refreshToken) => {
    const response = await fetch('http://192.168.141.132/auth/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Ошибка обновления токена');
    }

    const data = await response.json();
    return data.access; // Возвращаем новый access_token
};

// Функция обработки истечения сессии
const handleSessionExpired = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // Перенаправление на LoginPage
    const navigate = useNavigate();
    navigate('/'); // Перенаправляем пользователя на страницу логина
};

export const apiClient = createApiClient('http://192.168.141.132');