import { Inter } from "next/font/google";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

function getCoordinatesFromMapsUrl(url) {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const matches = url.match(regex);
    if (matches && matches.length >= 3) {
        const lat = parseFloat(matches[1]);
        const lng = parseFloat(matches[2]);
        return { lat, lng };
    }
    return null;
}

export default function Home() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    });

    const [url, setUrl] = useState("");
    const [coordinate, setCoordinate] = useState({
        lat: undefined,
        lng: undefined,
    });
    const [center, setCenter] = useState({
        lat: 18.788,
        lng: 98.985,
    });

    const onUrlSubmit = (e) => {
        e.preventDefault();
        const coordinate = getCoordinatesFromMapsUrl(url);
        if (coordinate) {
            setCoordinate(coordinate);
            setCenter(coordinate);
        } else {
            console.log("Invalid input.");
        }
    };

    const onMapClick = (e) => {
        e.domEvent.preventDefault();

        const clickedPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        console.log("coordinate :", clickedPosition);

        if (clickedPosition) {
            setCoordinate(clickedPosition);
        }
    };

    const onClear = (e) => {
        e.preventDefault();

        setCoordinate({
            lat: "",
            lng: "",
        });
        setUrl("");

		console.log("Clear coordinate.");
    };

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>;
    }

    return (
        <main
            className={`flex flex-col items-center justify-between max-w-[1000px] mx-auto py-8 md:py-20 px-4 ${inter.className}`}
        >
            <div className="flex flex-col w-full md:w-2/3">
                {/* Url input  */}
                <div className="block">
                    <label className="block text-xs md:text-sm font-medium tracking-wide">
                        Ex.{" "}
                        <span className="text-blue-700">
                            https://www.google.com/maps/@18.7685198,98.9727598,15z
                        </span>
                    </label>
                    <div className="flex items-center justify-center gap-x-2 mb-4">
                        <input
                            type="text"
                            placeholder="Google maps url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="border border-gray-300 rounded-md py-1 px-3 w-full"
                        />
                        <button
                            onClick={onUrlSubmit}
                            className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md py-1 px-3"
                        >
                            Find
                        </button>
                    </div>
                </div>
                {/* Lat, Lng input */}
                <div className="grid grid-cols-2 w-full gap-x-2 mb-4">
                    <div className="col-span-1">
                        <label className="block text-xs md:text-sm font-medium tracking-wide">
                            Latitude
                        </label>
                        <input
                            type="number"
                            placeholder="Latitude"
                            value={coordinate.lat}
                            onChange={(e) =>
                                setCoordinate((prev) => ({
                                    ...prev,
                                    lat: e.target.valueAsNumber,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-md py-1 px-3"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs md:text-sm font-medium tracking-wide">
                            Longtitude
                        </label>
                        <input
                            type="number"
                            placeholder="Longtitude"
                            value={coordinate.lng}
                            onChange={(e) =>
                                setCoordinate((prev) => ({
                                    ...prev,
                                    lng: e.target.valueAsNumber,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-md py-1 px-3"
                        />
                    </div>
                </div>
                <div className="flex flex-row-reverse mb-6">
                    <button
                        onClick={onClear}
                        className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md py-1 px-3"
                    >
                        Refresh
                    </button>
                </div>
            </div>
            {/* Map Component */}
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <GoogleMap
                        mapContainerClassName="w-full h-[400px] md:h-[700px]"
                        center={center}
                        zoom={14}
                        onClick={onMapClick}
                    >
                        {coordinate.lat && coordinate.lng ? (
                            <MarkerF position={coordinate} />
                        ) : null}
                    </GoogleMap>
                </>
            )}
        </main>
    );
}
