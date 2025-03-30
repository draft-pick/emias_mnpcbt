import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CountrySelect = ({ countries, placeholder = "Выберите страну", ...props }) => {
    const [filteredCountries, setFilteredCountries] = useState(countries);

    const handleSearch = (value) => {
        const filtered = countries.filter((country) =>
            country.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCountries(filtered);
    };

    return (
        <Select
            showSearch
            placeholder={placeholder}
            onSearch={handleSearch}
            filterOption={false}
            {...props}
        >
            {filteredCountries.map((country) => (
                <Option key={country} value={country}>
                    {country}
                </Option>
            ))}
        </Select>
    );
};

export default CountrySelect;