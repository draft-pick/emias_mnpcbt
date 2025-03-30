import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/UI/ThemeSwitcher";

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item key="dashboard" onClick={() => navigate("/dashboard")}>
                        Главная
                    </Menu.Item>
                    <Menu.Item key="patients" onClick={() => navigate("/patients")}>
                        Пациенты
                    </Menu.Item>
                </Menu>
                <ThemeSwitcher />
            </Header>
            <Content style={{ padding: "20px" }}>
                <Outlet />
            </Content>
            <Footer style={{ textAlign: "center" }}>Медицинская система ©2025</Footer>
        </Layout>
    );
}