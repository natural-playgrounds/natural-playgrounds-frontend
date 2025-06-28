import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function GoogleAutocomplete({ 
  defaultValue, 
  onPlaceSelected, 
  onChange,
  required = false, 
  className = "",
  options = {}
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (inputRef.current && google.maps.places) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            componentRestrictions: { country: ['us', 'ca'] },
            ...options
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log('Google Place selected:', place);
            
            if (place && place.address_components && onPlaceSelected) {
              onPlaceSelected(place);
            }
          });

          autocompleteRef.current = autocomplete;
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      initAutocomplete();
    } else {
      console.warn('Google Maps API key not found');
    }
  }, [onPlaceSelected, options]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      required={required}
      className={className}
      placeholder="Start typing an address..."
      onChange={onChange}
    />
  );
}