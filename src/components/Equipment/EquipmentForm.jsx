import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EquipmentForm = ({ onClose, equipmentData = null }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState(equipmentData || {});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/equipment/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            if (equipmentData) {
                setSelectedCategory(equipmentData.category);
                setFormData(equipmentData);
                const category = categories.find((cat) => cat.categoryName === equipmentData.category);
                if (category) {
                    setFields(category.fields);
                }
            } else {
                setSelectedCategory('');
                setFormData({});
            }
        }
    }, [categories, equipmentData]);

    useEffect(() => {
        if (selectedCategory && categories.length > 0) {
            const category = categories.find((cat) => cat.categoryName === selectedCategory);
            if (category) {
                setFields(category.fields);
            }
        }
    }, [selectedCategory, categories]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = equipmentData ? 'PUT' : 'POST';
        const url = equipmentData
            ? `/api/equipment/${equipmentData.equipmentId}`
            : '/api/equipment/new';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ ...formData, category: selectedCategory }),
            });

            if (response.ok) {
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Failed to submit equipment:', errorData.message);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting equipment:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h2>{equipmentData ? 'Edytuj Sprzęt' : 'Dodaj Nowy Sprzęt'}</h2>
                <form onSubmit={handleSubmit}>
                    {!equipmentData && (
                        <div>
                            <label>Kategoria:</label>
                            <select value={selectedCategory} onChange={handleCategoryChange} required>
                                <option value="">Wybierz kategorię</option>
                                {categories.map((category) => (
                                    <option key={category.categoryName} value={category.categoryName}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {selectedCategory && (
                        <>
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label>{field.label}:</label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleInputChange}
                                        required={field.required}
                                    />
                                </div>
                            ))}
                            <div style={{marginTop: '20px'}}>
                                <button type="submit">{equipmentData ? 'Zapisz Zmiany' : 'Dodaj Sprzęt'}</button>
                                <button type="button" onClick={onClose} style={{marginLeft: '10px' }}>
                                    Anuluj
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    width: '500px',
    maxHeight: '80%',
    overflowY: 'auto',
};
EquipmentForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    equipmentData: PropTypes.shape({
        equipmentId: PropTypes.number,
        category: PropTypes.string,
    }),
};

export default EquipmentForm;
