import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.locale('ru');

const useFormatDate = () => {
    const formatDate = (date) => {
        if (!date) return 'Нет данных';
        const parsedDate = dayjs(date);
        return parsedDate.isValid() ? parsedDate.format('DD MMMM YYYY') : 'Неверный формат даты';
    };

    const parseToDayjs = (date) => {
        const parsedDate = dayjs(date);
        return parsedDate.isValid() ? parsedDate : null;
    };

    return { formatDate, parseToDayjs };
};

export default useFormatDate;