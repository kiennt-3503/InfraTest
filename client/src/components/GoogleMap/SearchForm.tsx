"use client";

import React, { useState, useRef } from "react";
import {
  ControlPosition,
  MapControl,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { CustomAutocompleteControlProps } from "../../types/googlemap";
import { lang } from "@/assets/lang/ja";

const SearchForm = ({ controlPosition }: CustomAutocompleteControlProps) => {
  const placesLib = useMapsLibrary("places");
  const map = useMap();
  const searchFormLocale = lang.googleMap.searchForm;

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPredictions = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (
      !input ||
      !placesLib ||
      !placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions
    )
      return;

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }

    try {
      const result =
        await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionTokenRef.current,
        });

      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelect = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!suggestion.placePrediction) return;

    const place = suggestion.placePrediction.toPlace();

    await place.fetchFields({
      fields: ["location"],
    });

    const location = place.location;

    if (location && map) {
      map.panTo(location);
      map.setZoom(16);
    }

    if (inputRef.current) {
      inputRef.current.value = place.formattedAddress || "";
    }

    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      handleSelect(suggestions[0]);
    }
  };
  <div className=""></div>;
  return (
    <MapControl position={controlPosition || ControlPosition.TOP_LEFT}>
      <div className="relative w-[500px] m-4 p-2 rounded-md flex flex-col gap-2 bg-base-100">
        <label className="input flex items-center gap-2 w-full">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            ref={inputRef}
            type="search"
            required
            placeholder={searchFormLocale.placeholder}
            onChange={fetchPredictions}
            onKeyDown={handleKeyDown}
            className="grow"
          />
        </label>

        {suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 shadow-md rounded-md max-h-60 overflow-auto">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="px-4 py-2 text-sm hover:bg-base-200 cursor-pointer"
                onClick={() => handleSelect(s)}
              >
                {s.placePrediction?.text.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </MapControl>
  );
};

export default SearchForm;
