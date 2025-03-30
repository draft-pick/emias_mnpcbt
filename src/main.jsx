import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, App } from "antd";
import AppRoutes from "./routes";
import "antd/dist/reset.css";
import "./assets/styles.css";
import "./assets/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ConfigProvider theme={{ token: { fontFamily: "Akt, sans-serif" } }}>
            <App>
                <AppRoutes />
            </App>
        </ConfigProvider>
    </React.StrictMode>
);