import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWidget from './ChartWidget';
import { Spin } from 'antd';
import { getUserStats } from '../../hooks/useApiClient';

export default function UserStats() {
    const [userStats, setUserStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserStats() {
            setLoading(true);
            try {
                const data = await getUserStats();
                const formattedData = data.map(user => ({
                    name: `${user.first_name} ${user.last_name}`,
                    количество: user.patient_count
                }));
                setUserStats(formattedData);
            } catch (error) {
                console.error("Ошибка загрузки статистики:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserStats();
    }, []);

    return (
        <ChartWidget>
            <div style={{ width: '100%', height: userStats.length * 40 + 100 }}>
                {loading ? (
                    <Spin />
                ) : userStats.length > 0 ? (
                    <ResponsiveContainer>
                        <BarChart
                            layout="vertical"
                            data={userStats}
                        >
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="количество" fill="#8884d8" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Нет данных для отображения</p>
                )}
            </div>
        </ChartWidget>
    );
}
