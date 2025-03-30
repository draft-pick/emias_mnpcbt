import useFormatDate from '../hooks/useFormatDate';
import CustomBadge from './UI/CustomBadge';

const Title = ({ title }) => {
    const { formatDate } = useFormatDate();
    const currentDate = formatDate(new Date());

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingTop: '30px',
            paddingBottom: '30px',
        }}>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <CustomBadge text={<span style={{}}>{currentDate}</span>} color="white" backgroundColor="var(--secondary-color)" />

        </div>
    );
};

export default Title;