import React, { useState, useEffect } from "react";
import { message, Row, Col } from "antd";
import HeaderCard from "../components/cards/HeaderCard";
import FilterCard from "../components/cards/FilterCard";
import ChartsCard from "../components/cards/ChartsCard";
import Container from "../components/Container";
import useApiRequest from "../hooks/useApiRequest";
import { useThemeColors } from '../hooks/useThemeColors';
import {
    getPatientsStats,
    getPatientsStatsMonth,
    getMe,
    getPatientsRegion
} from "../hooks/useApiClient";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');

const LOCAL_STORAGE_KEY = "visibleCharts";

const MainPage = () => {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [filteredStats, setFilteredStats] = useState({});
    const [visibleCharts, setVisibleCharts] = useState(() => {
        const savedCharts = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedCharts
            ? JSON.parse(savedCharts)
            : { gender: true, age: true, month: true, region: true };
    });

    const { data: me, loading: meLoading, meError } = useApiRequest(() => getMe(), []);
    const { data: statistics } = useApiRequest(() => getPatientsStats(), []);
    const { data: statisticsMonth } = useApiRequest(() => getPatientsStatsMonth(), []);
    const { data: statisticsRegion } = useApiRequest(() => getPatientsRegion(), []);

    const { themeAccentColor, themeTextColor, themeSecondaryColor, themeBackgroundColor } = useThemeColors();

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibleCharts));
    }, [visibleCharts]);

    const fetchStatistics = async (startDate = null, endDate = null) => {
        setLoading(true);
        try {
            const stats = await getPatientsStats(startDate, endDate);
            const statsMonth = await getPatientsStatsMonth(startDate, endDate);
            const statsRegion = await getPatientsRegion(startDate, endDate);
            setFilteredStats({ statistics: stats, statisticsMonth: statsMonth, statisticsRegion: statsRegion });
        } catch (error) {
            message.error("Ошибка загрузки данных.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
        if (!dates || dates.length === 0) {
            fetchStatistics();
            return;
        }
        const [startDate, endDate] = dates.map((date) => date.format("YYYY-MM-DD"));
        fetchStatistics(startDate, endDate);
    };

    const handleCheckboxChange = (chart) => {
        setVisibleCharts((prev) => ({ ...prev, [chart]: !prev[chart] }));
    };

    const totalPatients = filteredStats.statistics?.total_patients || statistics?.total_patients || 0;

    const genderData = statistics?.gender_distribution?.length > 0 ? {
        labels: statistics.gender_distribution.map(item =>
            item.gender === "male" ? "Мужчины" : "Женщины"
        ),
        datasets: [
            {
                label: "Пол",
                data: statistics.gender_distribution.map(item => item.count),
                backgroundColor: [themeAccentColor, themeSecondaryColor],
            },
        ],
    } : null;

    const ageData = statistics && Object.values(statistics.age_distribution).length > 0 ? {
        labels: ["0-18", "19-35", "36-60", "60+"],
        datasets: [
            {
                label: "Возрастное распределение",
                data: Object.values(statistics.age_distribution),
                backgroundColor: [themeAccentColor, themeSecondaryColor, "#ff6384", "#36a2eb"],
            },
        ],
    } : null;

    const regionSource = filteredStats.statisticsRegion || statisticsRegion;
    const regionData = regionSource?.length > 0 ? {
        labels: regionSource.map(item => item.region),
        datasets: [
            {
                label: "Количество пациентов",
                data: regionSource.map(item => item.count),
                backgroundColor: regionSource.map((_, index) =>
                    index % 2 === 0 ? themeAccentColor : themeSecondaryColor
                ),
            },
        ],
    } : null;

    const monthSource = filteredStats.statisticsMonth || statisticsMonth;
    const monthData = monthSource?.length > 0 ? {
        labels: monthSource.map(item => item.month),
        datasets: [
            {
                label: "Количество пациентов",
                data: monthSource.map(item => item.count),
                borderColor: themeAccentColor,
                backgroundColor: themeAccentColor,
                fill: true,
            },
        ],
    } : null;

    return (
        <Container style={{marginTop: '20px'}}>
            <Row gutter={20}>
                <Col xs={24} md={6}>
                    <HeaderCard
                        currentDate={dayjs().format("DD MMMM YYYY")}
                        me={me}
                        loading={meLoading}
                        error={meError}
                        themeAccentColor={"#1677ff"}
                        themeTextColor={"#000"}
                    />
                    <FilterCard
                        handleDateChange={handleDateChange}
                        visibleCharts={visibleCharts}
                        handleCheckboxChange={handleCheckboxChange}
                        themeAccentColor={"#1677ff"}
                        themeBackgroundColor={"#fff"}
                        themeSecondaryColor={"#eee"}
                    />
                </Col>
                <Col xs={24} md={18}>
                    <ChartsCard
                        loading={loading}
                        error={null}
                        visibleCharts={visibleCharts}
                        genderData={genderData}
                        ageData={ageData}
                        regionData={regionData}
                        monthData={monthData}
                        totalPatients={totalPatients}
                        renderError={(msg) => <p>{msg}</p>}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default MainPage;