import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './EquipmentForm.css'; // Dodanie pliku CSS dla stylów

const EquipmentForm = ({ onClose, equipmentData = null }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(equipmentData ? equipmentData.category : '');
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState(equipmentData || {});

    useEffect(() => {
        // Oryginalny kod pobierający kategorie z backendu
        /*
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
        */

        // Mockowane dane kategorii
        const mockCategories = [
            { categoryName: 'Traktory', fields: ['equipmentName', 'category', 'brand', 'model', 'power'] },
            { categoryName: 'Kombajny', fields: ['equipmentName', 'category', 'brand', 'model', 'capacity'] },
            { categoryName: 'Pługi', fields: ['equipmentName', 'category', 'brand', 'model', 'workingWidth'] },
            // Dodaj więcej kategorii według potrzeb
        ];
        setCategories(mockCategories);
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
        setFormData({ category: e.target.value }); // Resetuj dane formularza przy zmianie kategorii
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const method = equipmentData ? 'PUT' : 'POST';
        //const url = equipmentData ? `/api/equipment/${equipmentData.equipmentId}`: '/api/equipment/new';
        try {
            // Oryginalny kod wysyłający dane do backendu
            /*
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
            */

            // Mockowanie akcji dodawania/edycji sprzętu
            console.log('Submitting data:', { ...formData, category: selectedCategory });
            onClose();
        } catch (error) {
            console.error('Error submitting equipment:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{equipmentData ? 'Edytuj Sprzęt' : 'Dodaj Nowy Sprzęt'}</h2>
                <form onSubmit={handleSubmit}>
                    {!equipmentData && (
                        <div>
                            <label>Kategoria:</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                required
                                className="form-select"
                            >
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
                                <div key={field} className="form-group">
                                    <label>{field}:</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field] || ''}
                                        onChange={handleInputChange}
                                        required={field === 'equipmentName' || field === 'brand' || field === 'model'}
                                        className="form-input"
                                    />
                                </div>
                            ))}
                            <div className="form-buttons">
                                <button type="submit" className="form-submit-button">
                                    {equipmentData ? 'Zapisz Zmiany' : 'Dodaj Sprzęt'}
                                </button>
                                <button type="button" onClick={onClose} className="form-cancel-button">
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

EquipmentForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    equipmentData: PropTypes.shape({
        equipmentId: PropTypes.number,
        category: PropTypes.string,
    }),
};

export default EquipmentForm;
