import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import ChartWidget from './ChartWidget';

export default function RegionDistributionChart({ regionSource }) {
    const regionData = regionSource?.length > 0
        ? regionSource.map((item, index) => ({
            region: item.region,
            count: item.count,
            color: index % 2 === 0 ? '#8884d8' : '#ff6b6b'
        }))
        : [];

    return (
        <ChartWidget title="Распределение по странам:">
            <div style={{ width: '100%', height: regionData.length * 30 }}>
                {regionData.length > 0 ? (
                    <ResponsiveContainer>
                        <BarChart
                            layout="vertical"
                            data={regionData}
                            margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
                        >
                            <XAxis type="number" />
                            <YAxis dataKey="region" type="category" width={120} />
                            <Tooltip />
                            <Bar dataKey="count" barSize={20}>
                                {regionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Нет данных для отображения</p>
                )}
            </div>
        </ChartWidget>
    );
}