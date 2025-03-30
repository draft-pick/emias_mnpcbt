import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../hooks/useApiClient";
import { Spin, message } from "antd";

const SuperuserRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isSuperuser, setIsSuperuser] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getMe();
                if (user?.role === "superuser") {
                    setIsSuperuser(true);
                } else {
                    message.warning("У вас нет доступа к этой странице");
                }
            } catch (err) {
                message.error("Ошибка проверки прав доступа");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <Spin style={{ display: "block", margin: "100px auto" }} />;

    return isSuperuser ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default SuperuserRoute;