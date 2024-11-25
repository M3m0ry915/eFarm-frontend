import PropTypes from 'prop-types';
import './AddLandparcelForm.css';

export function ParcelForm({ parcelData, onChange, isEditMode }) {
    if (!parcelData) {
        return <p>Wybierz działkę, aby wyświetlić jej szczegóły.</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...parcelData, [name]: value });
    };

    // Lista pól, które mają być edytowalne w trybie edycji
    const editableFieldsInEditMode = [
        'landOwnershipStatus',
        'name',
        'longitude',
        'latitude',
        'Pole pow. w ewidencji gruntów (ha)',
    ];

    // Funkcja pomocnicza do określenia, czy pole jest edytowalne
    const isFieldEditable = (fieldName) => {
        if (!isEditMode) return true; // Jeśli nie jesteśmy w trybie edycji (czyli w trybie dodawania), wszystkie pola są edytowalne
        return editableFieldsInEditMode.includes(fieldName);
    };

    return (
        <form>
            <div>
                <label>Identyfikator działki:</label>
                <input
                    type="text"
                    name="Identyfikator działki"
                    value={parcelData['Identyfikator działki'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Identyfikator działki')}
                />
            </div>
            <div>
                <label>Status Własności:</label>
                <select
                    name="landOwnershipStatus"
                    value={parcelData.landOwnershipStatus || 'STATUS_PRIVATELY_OWNED'}
                    onChange={handleChange}
                    disabled={!isFieldEditable('landOwnershipStatus')}
                >
                    <option value="STATUS_PRIVATELY_OWNED">Własność Prywatna</option>
                    <option value="STATUS_LEASED">Dzierżawa</option>
                </select>
            </div>
            <div>
                <label>Nazwa:</label>
                <input
                    type="text"
                    name="name"
                    value={parcelData.name || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('name')}
                />
            </div>
            <div>
                <label>Województwo:</label>
                <input
                    type="text"
                    name="Województwo"
                    value={parcelData['Województwo'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Województwo')}
                />
            </div>
            <div>
                <label>Powiat:</label>
                <input
                    type="text"
                    name="Powiat"
                    value={parcelData['Powiat'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Powiat')}
                />
            </div>
            <div>
                <label>Gmina:</label>
                <input
                    type="text"
                    name="Gmina"
                    value={parcelData['Gmina'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Gmina')}
                />
            </div>
            <div>
                <label>Numer Obrębu Ewidencyjnego:</label>
                <input
                    type="text"
                    name="Obręb"
                    value={parcelData['Obręb'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Obręb')}
                />
            </div>
            <div>
                <label>Numer Działki:</label>
                <input
                    type="text"
                    name="Numer działki"
                    value={parcelData['Numer działki'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Numer działki')}
                />
            </div>
            <div>
                <label>Longitude:</label>
                <input
                    type="text"
                    name="longitude"
                    value={parcelData.longitude || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('longitude')}
                />
            </div>
            <div>
                <label>Latitude:</label>
                <input
                    type="text"
                    name="latitude"
                    value={parcelData.latitude || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('latitude')}
                />
            </div>
            <div>
                <label>Area:</label>
                <input
                    type="text"
                    name="Pole pow. w ewidencji gruntów (ha)"
                    value={parcelData['Pole pow. w ewidencji gruntów (ha)'] || ''}
                    onChange={handleChange}
                    readOnly={!isFieldEditable('Pole pow. w ewidencji gruntów (ha)')}
                />
            </div>
        </form>
    );
}

ParcelForm.propTypes = {
    parcelData: PropTypes.shape({
        'Identyfikator działki': PropTypes.string,
        landOwnershipStatus: PropTypes.string,
        name: PropTypes.string,
        'Województwo': PropTypes.string,
        'Powiat': PropTypes.string,
        'Gmina': PropTypes.string,
        'Obręb': PropTypes.string,
        'Numer działki': PropTypes.string,
        longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        'Pole pow. w ewidencji gruntów (ha)': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    onChange: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
};
