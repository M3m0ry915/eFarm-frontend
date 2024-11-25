import { useState } from 'react';
import { MapComponent } from './Map';
import { ParcelForm } from './AddLandParcelForm'; // Import your existing ParcelForm
import './AddLandparcel.css';
import { parseXmlResponse } from '../helpers/parseXmlResponse';
import PropTypes from 'prop-types';

const AddLandparcel = ({ onClose }) => {
    const [selectedParcel, setSelectedParcel] = useState({
        'Identyfikator działki': '',
        landOwnershipStatus: 'STATUS_PRIVATELY_OWNED',
        name: '',
        'Województwo': '',
        'Powiat': '',
        'Gmina': '',
        'Obręb': '',
        'Numer działki': '',
        longitude: '',
        latitude: '',
        'Pole pow. w ewidencji gruntów (ha)': '',
    });

    // Handle map clicks
    const handleMapClick = async ({ i, j, width, height, bbox, latitude, longitude }) => {
        const wmsUrl = `https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=dzialki,numery_dzialek,budynki&query_layers=dzialki,numery_dzialek,budynki&transparency=true&format=image/png&info_format=text/xml&srs=EPSG:4326&bbox=${bbox}&width=${width}&height=${height}&x=${i}&y=${j}`;

        try {
            const response = await fetch(wmsUrl);
            const data = await response.text();
            const parsedData = parseXmlResponse(data);
            const areaString = parsedData['Pole pow. w ewidencji gruntów (ha)'];
            const areaNumber = parseFloat(areaString.replace(',', '.')); // Zamiana przecinka na kropkę

            const combinedData = {
                ...parsedData,
                'Pole pow. w ewidencji gruntów (ha)': areaNumber,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            };
            console.log(combinedData);
            setSelectedParcel(combinedData);
        } catch (error) {
            console.error('Error fetching WMS data:', error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedParcel) {
            console.error('No parcel selected');
            return;
        }
        const requiredFields = [
            'landOwnershipStatus',
            'name',
            'longitude',
            'latitude',
            'Pole pow. w ewidencji gruntów (ha)',
        ];

        for (const field of requiredFields) {
            if (!selectedParcel[field] || selectedParcel[field].toString().trim() === '') {
                alert(`Proszę wprowadzić wartość dla pola: ${field}`);
                return;
            }
        }
        // Konwersja wartości na liczby
        const longitude = parseFloat(selectedParcel.longitude);
        const latitude = parseFloat(selectedParcel.latitude);
        const area = parseFloat(selectedParcel['Pole pow. w ewidencji gruntów (ha)']);

        // Walidacja
        if (isNaN(longitude) || isNaN(latitude) || isNaN(area)) {
            alert('Proszę wprowadzić poprawne wartości liczbowe dla długości, szerokości i powierzchni.');
            return;
        }

        const formData = {
            landOwnershipStatus: selectedParcel.landOwnershipStatus || 'STATUS_PRIVATELY_OWNED',
            name: selectedParcel.name || '',
            voivodeship: selectedParcel['Województwo'],
            district: selectedParcel['Powiat'],
            commune: selectedParcel['Gmina'],
            geodesyDistrictNumber: selectedParcel['Obręb'],
            landparcelNumber: selectedParcel['Numer działki'],
            geodesyLandparcelNumber: selectedParcel['Identyfikator działki'],
            longitude: selectedParcel.longitude,
            latitude: selectedParcel.latitude,
            area: selectedParcel['Pole pow. w ewidencji gruntów (ha)'],
        };

        // Original code sending data to the backend (currently commented)
        /*
        try {
          const response = await fetch('/api/landparcel/new', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            onClose();
          } else {
            console.error('Failed to add parcel');
          }
        } catch (error) {
          console.error('Error adding parcel:', error);
        }
        */

        // Mock action
        console.log('Adding parcel:', formData);
        onClose();
    };

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h3>Dodaj Nową Działkę</h3>
                <div className="parcel-container">
                    <div className="form-wrapper">
                        <ParcelForm parcelData={selectedParcel} onChange={setSelectedParcel} isEditMode={false} />
                        {selectedParcel && (
                            <div style={{ marginTop: '20px' }}>
                                <button onClick={handleSubmit}>Dodaj Działkę</button>
                                <button onClick={onClose} style={{ marginLeft: '10px' }}>
                                    Anuluj
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="map-wrapper">
                        <MapComponent onMapClick={handleMapClick} />
                    </div>
                </div>
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
    width: '90%',
    maxHeight: '90%',
    overflowY: 'auto',
};

AddLandparcel.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default AddLandparcel;
