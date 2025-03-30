import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import UITestPage from "../pages/UITestPage";
import SidebarLayout from "../layouts/SidebarLayout";
import ProtectedRoute from "./ProtectedRoute";
import SuperuserRoute from './SyperuserRoute';
import PatientCreate from "../pages/PatientCreate";
import PatientList from "../pages/PatientList";
import PatientDetailsPage from "../pages/PatientDetailPage";
import PatientEdit from "../pages/PatientEdit";
import News from "../pages/News";
import UsersPage from "../pages/UsersPage";
import StatisticsPage from "../pages/StatiscticsPage";
import { useState } from "react";


function AppRoutes() {
    const [refreshUnreadCount, setRefreshUnreadCount] = useState(false);

    const triggerRefreshUnread = () => {
        setRefreshUnreadCount(true);
    };

    const resetRefreshTrigger = () => {
        setRefreshUnreadCount(false);
    };
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<SidebarLayout
                        refreshUnreadCount={refreshUnreadCount}
                        resetRefreshTrigger={resetRefreshTrigger}
                    />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/patients/create" element={<PatientCreate />} />
                        <Route path="/patients" element={<PatientList />} />
                        <Route path="/patients/:id" element={<PatientDetailsPage />} />
                        <Route path="/patients/:id/edit" element={<PatientEdit />} />
                        <Route path="/news" element={<News triggerRefreshUnread={triggerRefreshUnread} />} />
                        <Route element={<SuperuserRoute />}>
                            <Route path="/users" element={<UsersPage />} />
                        </Route>
                        <Route path="/stats" element={<StatisticsPage />} />
                    </Route>
                    <Route path="/ui-test" element={<UITestPage />} />
                    <Route path="*" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default AppRoutes;