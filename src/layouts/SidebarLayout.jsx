import {
    Layout, Menu, Typography, Skeleton, Flex, Dropdown
} from "antd";
import {
    HomeOutlined, UserOutlined, SettingOutlined,
    MenuUnfoldOutlined, MenuFoldOutlined,
} from "@ant-design/icons";
import {
    IoAddCircleOutline, IoNewspaperOutline, IoChatbubblesOutline
} from "react-icons/io5";
import { FaUsersGear, FaCircleUser, FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import logo_light from "../assets/images/logo-light.png";
import logo_dark from "../assets/images/logo-dark.png";
import useTheme from "../hooks/useTheme";
import useApiRequest from "../hooks/useApiRequest";
import {
    getMe, getNewsUnread
} from "../hooks/useApiClient";
import CustomSwitch from "../components/UI/CustomSwitch";
import CustomButton from "../components/UI/CustomButton";
import CustomInput from "../components/UI/CustomInput";
import UnreadNewsBadge from "../components/UnreadNewsBadge";
import { FiSearch } from "react-icons/fi";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

export default function SidebarLayout({ refreshUnreadCount, resetRefreshTrigger }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: newsUnread, loading, error, refetch } = useApiRequest(() => getNewsUnread(), []);

    const { data: me, loading: meLoading, meError } = useApiRequest(() => getMe(), []);


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const toggleSider = () => setCollapsed(!collapsed);

    const dropdownMenu = {
        items: [
            {
                key: 'role',
                label: me?.role === 'superuser' ? 'суперпользователь' : 'пользователь',
                disabled: true
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: 'Выход',
                onClick: handleLogout
            }
        ]
    };


    return (
        <Layout
            style={{
                minHeight: "100vh",
                maxWidth: "1600px",
                margin: "auto",
            }}
        >
            <Sider
                theme={theme}
                collapsible
                collapsed={collapsed}
                width={250}
                trigger={null}
                style={{
                    backgroundColor: "var(--sider-background)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflowY: "auto",
                    zIndex: 100,
                }}
            >

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "15px",
                        }}>
                            <img src={theme === 'light' ? logo_light : logo_dark} alt="Logo" style={{ height: "40px" }} />
                            <CustomButton
                                type="outline" iconSize="20px"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={toggleSider}
                            />
                        </div>

                        <Menu
                            style={{ backgroundColor: "var(--sider-background)" }}
                            theme={theme === "dark" ? "dark" : "light"}
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            onClick={({ key }) => navigate(key)}
                            items={[
                                { key: "/dashboard", icon: <HomeOutlined />, label: "Главная" },
                                { key: "/patients", icon: <UserOutlined />, label: "Пациенты" },
                                { key: "/patients/create", icon: <IoAddCircleOutline />, label: "Добавить пациента" },
                                {
                                    key: "/news", icon: <IoNewspaperOutline />,
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>Новости</span>
                                            <UnreadNewsBadge
                                                refreshTrigger={refreshUnreadCount}
                                                resetRefreshTrigger={resetRefreshTrigger}
                                            />
                                        </div>
                                    )
                                },
                                { key: "/stats", icon: <SettingOutlined />, label: "Статистика" },
                                { key: "/users", icon: <FaUsersGear />, label: "Пользователи" },
                                { key: "/feedback", icon: <IoChatbubblesOutline />, label: "Обратная связь" },
                                { key: "/settings", icon: <SettingOutlined />, label: "Настройки" },
                            ]}
                        />
                    </div>

                    <div
                        style={{
                            margin: "15px",
                            color: "var(--placeholder-color)",
                            fontWeight: "100",
                            fontSize: "12px",
                            textAlign: "right",
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'end',
                            color: 'var(--text-color)',
                            marginBottom: '20px',
                            }}>
                            {`${theme === "dark" ? "Светлая" : "Тёмная"} тема`}
                            <CustomSwitch size="large" onChange={toggleTheme} checked={theme === "dark"} />
                        </div>
                        <h3>Отдел информатизации</h3>
                        <span>version: Beta 0.4</span>
                    </div>
                </div>
            </Sider>

            <Layout>
                <Header
                    style={{
                        backgroundColor: "var(--sider-background)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 10px",
                    }}
                >
                    <CustomInput placeholder="...Введите запрос..." prefix={<FiSearch />} />
                    <div style={{
                        paddingTop: "5px",
                        paddingLeft: "5px",
                        textAlign: "center",
                    }}>
                        {meLoading ? (
                            <Skeleton paragraph={{ rows: 2 }} active size="large" />
                        ) : meError ? (
                            <Text style={{ color: "var(--error-color)" }}>Ошибка загрузки</Text>
                        ) : (
                            <Text style={{ color: "var(--text-color)", textAlign: "start" }}>
                                <Flex align="center">
                                    <FaCircleUser style={{ marginRight: "5px", fontSize: '30px', color: 'var(--text-color)' }} />
                                    {!collapsed && (
                                        <Dropdown
                                            menu={dropdownMenu}
                                            trigger={['click']}
                                            onOpenChange={setDropdownOpen}
                                            placement="bottomRight"
                                        >
                                            <div style={{
                                                marginRight: '10px',
                                                fontWeight: '400',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                <div>
                                                    <div>{me?.first_name} {me?.last_name}</div>
                                                </div>
                                                {dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
                                            </div>
                                        </Dropdown>
                                    )}
                                </Flex>
                            </Text>
                        )}
                    </div>
                </Header>
                <Content
                    style={{
                        border: "1px solid var(--sider-border)",
                        margin: "10px",
                        padding: "15px",
                        borderRadius: "10px",
                        backgroundColor: "var(--sider-content)",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}