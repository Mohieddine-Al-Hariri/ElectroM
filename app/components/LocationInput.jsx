import { useState } from 'react';
import { SVGCheck, SVGDefault } from '.';

const LocationInput = ({ location, selectedLocation, setSelectedLocation }) => {
  const [error, setError] = useState('');

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation(`${latitude}, ${longitude}`);
          setError('');
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            const confirmed = window.confirm("Geolocation is denied. Please use Google Maps to get your coordinates and paste them below.");
            if (confirmed) {
              window.open("https://www.google.com/maps");
            }
          } else {
            setError('Unable to retrieve location. Please try again later.');
          }
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleInputChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  return(
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md mt-2 ">
      <input
        type="text"
        value={selectedLocation}
        onChange={handleInputChange}
        placeholder="Enter your location..."
        className="mt-4 px-2 py-1 w-full border rounded mb-2 colorScheme "
      />
      <div className='flex gap-1 justify-center '>

        <button
          onClick={getLocation}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex gap-3 justify-center items-center  "
        >
          <svg width="24px" height="24px" viewBox="0 0 0.6 0.6" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M0.406 0.101A0.152 0.152 0 0 0 0.301 0.056h-0.002a0.152 0.152 0 0 0 -0.15 0.15c0 0.028 0.007 0.056 0.023 0.079L0.29 0.525h0.02l0.118 -0.239c0.015 -0.024 0.023 -0.051 0.023 -0.079a0.152 0.152 0 0 0 -0.045 -0.105zM0.297 0.094l0.003 0 0.003 0a0.115 0.115 0 0 1 0.11 0.114 0.103 0.103 0 0 1 -0.018 0.059l-0.001 0.001 -0.001 0.001L0.3 0.46l-0.094 -0.191 -0.001 -0.001 -0.001 -0.001a0.103 0.103 0 0 1 -0.018 -0.059A0.115 0.115 0 0 1 0.297 0.094zm0.023 0.081a0.037 0.037 0 1 0 -0.042 0.062 0.037 0.037 0 0 0 0.042 -0.062zM0.258 0.144a0.075 0.075 0 1 1 0.083 0.125 0.075 0.075 0 0 1 -0.083 -0.125z"/></svg>
          Get Current Location
        </button>
        <button onClick={() => setSelectedLocation(location)} className='bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex gap-3 justify-center items-center'>
          <SVGDefault />
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default LocationInput;
