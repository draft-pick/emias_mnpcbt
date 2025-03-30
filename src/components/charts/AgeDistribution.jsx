import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWidget from './ChartWidget';

export default function AgeDistributionChart({ statistics }) {
    const ageData = Object.keys(statistics).length > 0
        ? [
            { ageGroup: "0-14", "Количество": statistics["0-14"] || 0 },
            { ageGroup: "15-21", "Количество": statistics["15-21"] || 0 },
            { ageGroup: "22-40", "Количество": statistics["22-40"] || 0 },
            { ageGroup: "41-60", "Количество": statistics["41-60"] || 0 },
            { ageGroup: "61+", "Количество": statistics["61+"] || 0 }
        ]
        : [];

    return (
        <ChartWidget title="Возрастные группы:">
            <div style={{ width: '100%', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {ageData.some(item => item["Количество"] > 0) ? (
                    <ResponsiveContainer>
                        <BarChart data={ageData}>
                            <XAxis 
                                dataKey="ageGroup" 
                                axisLine={{ stroke: '#8884d8', strokeWidth: 2 }} 
                                tick={{ fontSize: 13, fill: '#555' }} 
                            />
                            <YAxis 
                                axisLine={{ stroke: '#8884d8', strokeWidth: 2 }} 
                                tick={{ fontSize: 13, fill: '#555' }} 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: '8px', border: '1px solid #ccc' }}
                                labelStyle={{ color: "#444", fontWeight: "bold" }}
                                cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                            />
                            <Bar 
                                dataKey="Количество"
                                fill="#8884d8"
                                radius={[6, 6, 0, 0]}
                                barSize={35}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Нет данных для отображения</p>
                )}
            </div>
        </ChartWidget>
    );
}