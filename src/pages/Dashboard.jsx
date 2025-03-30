import { useState, useEffect } from "react";
import { Row, Col, DatePicker, Space, Skeleton, message, Flex, Timeline } from "antd";
import Title from "../components/Title";
import CustomCheckbox from "../components/UI/CustomCheckbox";
import CustomBadge from "../components/UI/CustomBadge";
import Area from "../components/UI/Area";
import GenderChart from "../components/charts/Gender";
import AgeDistributionChart from "../components/charts/AgeDistribution";
import RegionDistributionChart from "../components/charts/RegionDistribution";
import MonthDistributionChart from "../components/charts/MonthDistribution";
import useApiRequest from "../hooks/useApiRequest";
import {
    getPatientsStats,
    getPatientsRegion,
    getPatientsStatsMonth,
    getPatients
} from "../hooks/useApiClient";
import DateFormatter from "../components/DateFormatter";
import { Link } from "react-router-dom";
import UserStats from "../components/charts/UserStats";

const LOCAL_STORAGE_KEY = "visibleCharts";
const { RangePicker } = DatePicker;

export default function Dashboard() {
    const { data: statistics = {}, loading: statisticsLoading } = useApiRequest(() => getPatientsStats(), []);
    const { data: statisticsRegion = {} } = useApiRequest(() => getPatientsRegion(), []);
    const { data: statisticsMonth = {} } = useApiRequest(() => getPatientsStatsMonth(), []);

    const [filteredStats, setFilteredStats] = useState(null);
    const [filteredRegionStats, setFilteredRegionStats] = useState(null);
    const [filteredStatsMonth, setFilteredStatsMonth] = useState(null);
    const [recentPatients, setRecentPatients] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [loading, setLoading] = useState(false);

    const [visibleCharts, setVisibleCharts] = useState(() => {
        const savedCharts = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedCharts ? JSON.parse(savedCharts) : { gender: true, age: true, month: true, region: true };
    });

    useEffect(() => {
        if (!dateRange.length) {
            setFilteredStats(statistics);
            setFilteredRegionStats(statisticsRegion);
            setFilteredStatsMonth(statisticsMonth);
        }
        fetchRecentPatients();
    }, [statistics, statisticsRegion]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibleCharts));
    }, [visibleCharts]);

    const fetchStatistics = async (startDate = null, endDate = null) => {
        setLoading(true);
        try {
            const stats = await getPatientsStats(startDate, endDate);
            const regionStats = await getPatientsRegion(startDate, endDate);
            const statsMonth = await getPatientsStatsMonth(startDate, endDate);
            setFilteredStats(stats);
            setFilteredRegionStats(regionStats);
            setFilteredStatsMonth(statsMonth);
        } catch (error) {
            message.error("Ошибка загрузки данных.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentPatients = async () => {
        try {
            const response = await getPatients(1);
            const patients = response.results || [];
            const sortedPatients = patients.sort(
                (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            );
            setRecentPatients(sortedPatients.slice(0, 7));
        } catch (error) {
            message.error("Ошибка загрузки последних записей.");
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates || []);
        if (!dates || dates.length === 0) {
            setFilteredStats(statistics);
            setFilteredRegionStats(statisticsRegion);
            return;
        }
        const [startDate, endDate] = dates.map((date) => date.format("YYYY-MM-DD"));
        fetchStatistics(startDate, endDate);
    };

    const currentStats = filteredStats || statistics || {};
    const currentRegionStats = filteredRegionStats || statisticsRegion || {};
    const currentStatsMonth = filteredStatsMonth || statisticsMonth || {};
    const totalPatients = currentStats.total_patients || 0;

    return (
        <>
            <Title title="Главная страница" />
            <Row gutter={10}>
                <Col xs={24} md={12} lg={16}>
                    <Area>
                        <div>
                            <Row gutter={[20, 20]}>
                                <Col xs={24} lg={16}>
                                    <h4>Выберите период:</h4>
                                    <RangePicker
                                        style={{ width: "100%" }}
                                        onChange={handleDateChange}
                                        placeholder={["Начало периода", "Конец периода"]}
                                    />
                                </Col>
                                <Col xs={24} lg={8}>
                                    <div style={{ textAlign: "end" }}>
                                        {(statisticsLoading || loading) ? (
                                            <Skeleton.Button active size="small" />
                                        ) : (
                                            <CustomBadge color="white" backgroundColor="var(--secondary-color)" text={`Пациентов-${totalPatients}`} />
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Space size="large" style={{ marginBottom: '20px', marginTop: '20px' }}>
                                {Object.keys(visibleCharts).map((chartKey) => (
                                    <CustomCheckbox
                                        key={chartKey}
                                        checked={visibleCharts[chartKey]}
                                        onChange={() => setVisibleCharts((prev) => ({ ...prev, [chartKey]: !prev[chartKey] }))}
                                    >
                                        {chartKey === "gender" ? "Пол" :
                                            chartKey === "age" ? "Возраст" :
                                                chartKey === "region" ? "По регионам" :
                                                    "Пациенты за 12 месяцев"}
                                    </CustomCheckbox>
                                ))}
                            </Space>
                            <Space
                                direction="vertical"
                                size="small"
                                style={{
                                    display: 'flex',
                                }}
                            >
                                {visibleCharts.gender && <GenderChart statistics={currentStats.gender_distribution || []} />}
                                {visibleCharts.age && <AgeDistributionChart statistics={currentStats.age_distribution || []} />}
                                {visibleCharts.region && <RegionDistributionChart regionSource={currentRegionStats || []} />}
                                {visibleCharts.month && <MonthDistributionChart monthSource={currentStatsMonth || []} />}
                            </Space>
                        </div>
                    </Area>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Area>
                        <h4 style={{ marginBottom: '20px' }}>Последние записи:</h4>
                        <Timeline>
                            {recentPatients.map((patient, i) => (
                                <Timeline.Item key={i} color="var(--secondary-color)">
                                    <Link to={`/patients/${patient.id}`}>
                                        <Flex>
                                            <div>
                                                <h5 style={{ marginBottom: '0' }}>{patient.last_name}</h5>
                                                <h5>{patient.first_name}</h5>
                                            </div>
                                            <h5 style={{marginLeft: '10px'}}>№{patient.card_number}</h5>
                                        </Flex>
                                        <div style={{ fontWeight: '300', fontSize: '10px', fontStyle: 'italic' }}>
                                                <DateFormatter dateString={patient.updated_at} />
                                            </div>
                                    </Link>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                        {<UserStats />}
                    </Area>
                </Col>
            </Row>
        </>
    );
}