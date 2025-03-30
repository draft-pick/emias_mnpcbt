import React from "react";
import { Card } from "antd";

const Area = ({ children, style }) => {
    return (
        <Card
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                padding: "15px",
                border: "none",
                backgroundColor: "var(--sider-background)",
                ...style,
            }}
        >
            {children}
        </Card>
    );
};

export default Area;