import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ChartWidget from './ChartWidget';

// Функция конвертации номера месяца в название на русском языке
const getMonthName = (monthNumber) => {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return monthNames[parseInt(monthNumber, 10) - 1];
};

export default function MonthDistributionChart({ monthSource }) {
    const formattedData = monthSource?.length > 0
        ? monthSource.map(item => ({
            month: getMonthName(item.month.slice(5)),
            количество: item.count
        }))
        : [];

    return (
        <ChartWidget title="Распределение по месяцам за год">
            <div style={{ width: '100%', height: '300px' }}>
                {formattedData.length > 0 ? (
                    <ResponsiveContainer>
                        <AreaChart data={formattedData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="количество"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Нет данных для отображения</p>
                )}
            </div>
        </ChartWidget>
    );
}