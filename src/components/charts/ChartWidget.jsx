import { useState } from "react";
import CustomCard from "../UI/CustomCard";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { TbArrowsMinimize, TbFileExcel } from "react-icons/tb";
import CustomButton from "../UI/CustomButton";
import { Flex } from "antd";

const ChartWidget = ({ title, children }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            style={{
                width: expanded ? '95vw' : 'auto',
                height: expanded ? '50vh' : 'auto',
                position: expanded ? 'fixed' : 'relative',
                top: expanded ? 0 : 'auto',
                left: expanded ? 0 : 'auto',
                background: expanded ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                zIndex: expanded ? 1000 : 'auto',
                transition: 'all 0.3s ease-in-out'
            }}>
            <CustomCard className="relative" hideTitle>
                <Flex align="center" wrap="wrap" justify="space-between">
                    <h4>{title}</h4>
                    <CustomButton type="outline" onClick={() => setExpanded(!expanded)}>
                        {expanded ? <TbArrowsMinimize /> : <AiOutlineExpandAlt />}
                    </CustomButton>
                </Flex>
                <div className="overflow-hidden" style={{ height: expanded ? '50vh' : '100%', width: expanded ? '90vw' : '100%' }}>
                    {children}
                </div>
            </CustomCard>
        </div>
    );
};

export default ChartWidget;
