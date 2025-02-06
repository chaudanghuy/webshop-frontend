import React, { useState } from 'react';

const DropdownSearch = ({ fieldData, value, onChange, style }) => {
    const [options, setOptions] = useState(fieldData?.options || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleSearchChange = (e) => {
        const term = e.target.value.trim();
        
        // Hiển thị dropdown khi gõ
        setDropdownOpen(true);

        // Gửi giá trị đã nhập về form
        if (term) {
            console.log("term", term);
            setSearchTerm(term);
            onChange({ id: fieldData.id, value: term, label: term });
        }
    };

    const handleOptionSelect = (option) => {
        console.log("option", option);
        onChange({ id: fieldData.id, value: option.id, label: option.name }); // Gửi giá trị đã chọn về form
        setSearchTerm(option.name);
        setDropdownOpen(true); // Đóng dropdown
    };

    const handleAddOption = () => {
        if (!options.some(option => option.name.toLowerCase() === searchTerm.toLowerCase()) && searchTerm.trim() !== '') {
            const newOption = { id: Date.now().toString(), name: searchTerm };
            const updatedOptions = [newOption, ...options];
            setOptions(updatedOptions); // Thêm vào đầu danh sách
            handleOptionSelect(newOption);
        }
    };

    const handleBlur = () => {
        // Đóng dropdown sau khi mất focus
        setTimeout(() => setDropdownOpen(false), 200);
    };

    // Lọc các tùy chọn dựa trên giá trị tìm kiếm
    const filteredOptions = options;

    const showAddNewOption = !filteredOptions.length && searchTerm.trim() !== '';

    return (
        <div style={{ marginTop: '10px', position: 'relative' }} className={style}>
            <label>{fieldData?.name}:</label>
            <input
                className='form-control'
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setDropdownOpen(true)} // Hiển thị dropdown khi focus
                onBlur={handleBlur}
                placeholder='Select..'
            />
            {isDropdownOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        zIndex: 10,
                    }}
                >
                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: value === option.name ? '#f0f0f0' : '#fff',
                            }}
                        >
                            {option.name}
                        </div>
                    ))}
                    {showAddNewOption && (
                        <div
                            onClick={handleAddOption}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: '#e7f7ff',
                                color: '#007bff',
                            }}
                        >
                            Add "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownSearch;
