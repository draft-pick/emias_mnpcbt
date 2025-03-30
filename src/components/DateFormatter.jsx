import dayjs from "dayjs";
import "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ru");

export default function DateFormatter({ dateString, format = "DD MMMM YYYY HH:mm" }) {
    if (!dateString) return null;

    const formattedDate = dayjs(dateString).tz("Europe/Moscow").format(format);

    return <span>{formattedDate}</span>;
}