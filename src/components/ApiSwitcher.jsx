import { Select, Typography, Space, message } from 'antd';

const { Text } = Typography;

const options = [
    {
        label: 'Локальный (127.0.0.1)',
        value: 'http://127.0.0.1:8000/api/v1',
    },
    {
        label: 'Сервер (10.149.98.12)',
        value: 'http://10.149.98.12/api/v1',
    },
    {
        label: 'Сервер (192.168.141.132)',
        value: 'http://192.168.141.132/api/v1',
    },
];

const ApiSwitcher = () => {
    const handleChange = (value) => {
        localStorage.setItem('apiBaseUrl', value);
        message.success('API-сервер переключен. Страница перезагрузится...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const current = localStorage.getItem('apiBaseUrl') || options[0].value;

    return (
        <Space direction="vertical" size="small">
            <Text type="secondary" style={{ fontSize: '12px' }}>
                Переключить API-сервер:
            </Text>
            <Select
                value={current}
                onChange={handleChange}
                options={options}
                style={{ width: 250 }}
            />
        </Space>
    );
};

export default ApiSwitcher;