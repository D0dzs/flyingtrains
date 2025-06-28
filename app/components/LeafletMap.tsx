"use client";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import {
  useBoundaryQuery,
  useMainRailwaysDataQuery,
  useStandardRailwaysDataQuery,
} from "~/hooks/useGeoData";

function ResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize(); // recalculates and fills missing tiles
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
}

const LeafletMap = ({
  trainData,
  isTrainLoading,
  trainError,
}: LeafletMapProps) => {
  const { data: mRD } = useMainRailwaysDataQuery();
  const { data: sRD } = useStandardRailwaysDataQuery();
  const { data: boundaryData, error: boundaryError } = useBoundaryQuery();

  if (isTrainLoading) {
    return (
      <div className="bg-[#101010] rounded flex flex-col gap-0 items-center justify-center min-h-screen w-full ">
        <span className="animate-pulse">Loading trains...</span>
        <div className="italic opacity-50">
          (This could take a while, hang tight!)
        </div>
      </div>
    );
  }

  if (trainError) {
    return (
      <div className="text-red-500 bg-[#101010] rounded flex items-center justify-center min-h-screen w-full ">
        <span className="animate-pulse">
          Error loading train data: {trainError.message}
        </span>
      </div>
    );
  }

  return (
    <MapContainer
      center={[47.4978789,19.25]}
      zoom={10}
      maxZoom={18}
      scrollWheelZoom
      preferCanvas
      zoomControl={false}
      className="ml-64!"
    >
      {/* Handle Resize when it's happening (it should work) */}
      <ResizeHandler />
      <GeoJSON data={mRD} style={{ color: "#6f6f6f", weight: 2 }} />
      <GeoJSON data={sRD} style={{ color: "#3f3f3f", weight: 1.25 }} />
      <GeoJSON data={boundaryData} style={{ fill: false, color: "#7f0000" }} />

      {/* Maptiles */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      
      s{/* Trains and their positions. */}
      {trainData.vehicles.map((vehicle: ProcessedVehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.lat!, vehicle.lon!]}
          title={vehicle.name}
          icon={L.divIcon({
            html: `
            <div id="marker-container" class="relative w-[26px] h-[26px]">
              <div id="circle" class="${
                vehicle.delayColor
              } absolute top-[2px] left-[2px] w-[22px] h-[22px] border-2 border-[#3f3f3f] rounded-full" />
              <div id="triangle-wrapper" class="absolute w-full h-full -z-10" style="transform-origin: center center; transform: rotate(${vehicle.hd!}deg)">
                <div id="triangle" class="triangle absolute top-[-6px] left-1/2 transform -translate-x-1/2" />
              </div>
            </div>`,
            className: "disappear-icon-haha",
            iconAnchor: [10, 10],
          })}
        >
          <Popup>
            <div className="text-white p-2 rounded">
              <code>{vehicle.name}</code>
              <p>Destination ➔ {vehicle.headsgn}</p>
              <table>
                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                </tr>
              </table>
              {/* {vehicle.delay ? (
                <p>
                  Delay ➔{" "}
                  {parseInt(vehicle.delay.toString()) > 0
                    ? vehicle.delay + " min"
                    : "No delay!"}
                </p>
              ) : null} */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
