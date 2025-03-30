import { useState, useEffect } from "react";
import { Row, Col, DatePicker, Space, Skeleton, message, Flex, Timeline } from "antd";
import Title from "../components/Title";
import CountrySelect from "./create/CountrySelect";
import countries from "./create/countries-list";
import CustomInput from "../components/UI/CustomInput";
import CustomForm from "../components/UI/CustomForm";
import { getMainStats } from "../hooks/useApiClient";

const { RangePicker } = DatePicker;

const StatisticsPage = () => {
    const [dateRange, setDateRange] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [regionStats, setRegionStats] = useState([]);
    const [summary, setSummary] = useState(null);

    const handleDateChange = (dates) => {
        setDateRange(dates || []);
    };

    const handleRegionChange = (regions) => {
        setSelectedRegions(regions);
    };

    const fetchStatistics = async () => {
        try {
            setLoading(true);

            const [startDate, endDate] = dateRange.length === 2
                ? dateRange.map(d => d.format("YYYY-MM-DD"))
                : [null, null];

            const regionQuery = selectedRegions.join(",");
            const data = await getMainStats(regionQuery, startDate, endDate);

            setRegionStats(data.regions || []);
            setSummary(data.summary || {});
        } catch (error) {
            message.error("Ошибка при загрузке статистики");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRegions.length > 0) {
            fetchStatistics();
        }
    }, [selectedRegions, dateRange]);

    return (
        <>
            <Title title="Статистика" />
            <Space direction="vertical" style={{ width: "400px" }} size="middle">
                <RangePicker
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                    placeholder={["Начало периода", "Конец периода"]}
                />

                <CountrySelect
                    style={{ width: "100%" }}
                    countries={countries}
                    onChange={handleRegionChange}
                    mode="multiple"
                    placeholder="Выберите страны"
                />
            </Space>

            {loading ? (
                <Skeleton active />
            ) : (
                <>
                    <h3 style={{ marginTop: "20px" }}>Регионы:</h3>
                    <ul>
                        {regionStats.map((region, index) => (
                            <li key={index}>
                                <strong>{region.region}:</strong>{" "}
                                всего: {region.total}, дети: {region.children}, женщины 18+: {region.women_18_plus}, мужчины 18+: {region.men_18_plus}, мужчины 18–65: {region.men_18_65}
                            </li>
                        ))}
                    </ul>

                    {summary && (
                        <>
                            <h3>Итого:</h3>
                            <ul>
                                <li>Дети: {summary.children}</li>
                                <li>Женщины 18+: {summary.women_18_plus}</li>
                                <li>Мужчины 18+: {summary.men_18_plus}</li>
                                <li>Мужчины 18–65: {summary.men_18_65}</li>
                            </ul>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default StatisticsPage;