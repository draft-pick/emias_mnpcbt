import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { App } from "antd";
import { apiClientLocal } from '../hooks/useApiClient';
import CustomButton from "../components/UI/CustomButton";
import CustomCard from "../components/UI/CustomCard";
import CustomSwitch from "../components/UI/CustomSwitch";
import CustomForm from "../components/UI/CustomForm";
import CustomInput from "../components/UI/CustomInput";
import ApiSwitcher from "../components/ApiSwitcher";
import { LuUser } from "react-icons/lu";
import { PiPassword } from "react-icons/pi";
import logo_light from "../assets/images/logo-light.png";
import logo_dark from "../assets/images/logo-dark.png";

export default function LoginPage() {
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const data = await apiClientLocal.post('/auth/token/login/', values);
            localStorage.setItem('authToken', data.auth_token);
            message.success('Успешный вход!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Ошибка при входе:', error);
            message.error(
                error.data?.detail ||
                error.message ||
                'Ошибка входа!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CustomCard title={<img src={theme === 'light' ? logo_light : logo_dark} alt="Logo" />} extra={<CustomSwitch onChange={toggleTheme} checked={theme === "dark"} />}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2>Добро пожаловать!</h2>
                </div>
                <CustomForm layout="vertical" onFinish={handleSubmit}>
                    <CustomForm.Item name="username" rules={[{ required: true, message: "Введите логин" }]}>
                        <CustomInput placeholder="...Логин..." icon={<LuUser />} />
                    </CustomForm.Item>
                    <CustomForm.Item name="password" rules={[{ required: true, message: "Введите пароль" }]}>
                        <CustomInput type="password" placeholder="...Пароль..." icon={<PiPassword />} />
                    </CustomForm.Item>
                    <CustomForm.Item>
                        <CustomButton type="primary" htmlType="submit" block loading={loading}>
                            Войти
                        </CustomButton>
                    </CustomForm.Item>
                </CustomForm>
                <div style={{ marginTop: '20px' }}>
                    <ApiSwitcher />
                </div>
                <div style={{ marginTop: '10px', textAlign: 'end', fontWeight: '100', fontSize: '10px'}}>Version: 0.0.5</div>
            </CustomCard>
        </div>
    );
}