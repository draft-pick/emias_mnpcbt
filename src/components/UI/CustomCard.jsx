import { Card } from "antd";

export default function CustomCard({ title, children, hoverable = false, extra, hideTitle = false, ...props }) {
    return (
        <Card
            style={{
                backgroundColor: "var(--card-background)",
                border: "1px solid var(--primary-border)",
                color: "var(--text-color)",
            }}
            styles={{
                body: {
                    color: "var(--text-color)",
                },
                header: {
                    backgroundColor: "var(--card-background)",
                    borderColor: "var(--primary-border)",
                    color: "var(--text-color)",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                }
            }}
            hoverable={hoverable}
            title={!hideTitle && (typeof title === "string" ? title : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {title}
                </div>
            ))}
            extra={extra}
            {...props}
        >
            {children}
        </Card>
    );
}