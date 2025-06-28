"use client";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";

import {
  useBoundaryQuery,
  useMainRailwaysDataQuery,
  useStandardRailwaysDataQuery,
} from "~/hooks/useGeoData";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import "leaflet/dist/leaflet.css";
import { formatTime } from "~/lib/utils";
import { customScrollbarStyles } from "~/lib/consts";

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
  const now = new Date();
  const nowInSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const { data: mRD } = useMainRailwaysDataQuery();
  const { data: sRD } = useStandardRailwaysDataQuery();
  const { data: boundaryData } = useBoundaryQuery();

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
      center={[47.4978789, 19.25]}
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
      {trainData.vehicles.map((v: ProcessedVehicle, idx: number) => (
        <Marker
          key={v.id}
          position={[v.lat!, v.lon!]}
          title={v.name}
          icon={L.divIcon({
            html: `
            <div id="marker-container" class="relative w-[26px] h-[26px]">
              <div id="circle" class="${
                v.delayColor
              } absolute top-[2px] left-[2px] w-[22px] h-[22px] border-2 border-[#3f3f3f] rounded-full" />
              <div id="triangle-wrapper" class="absolute w-full h-full -z-10" style="transform-origin: center center; transform: rotate(${v.hd!}deg)">
                <div id="triangle" class="triangle absolute top-[-6px] left-1/2 transform -translate-x-1/2" />
              </div>
            </div>`,
            className: "disappear-icon-haha",
            iconAnchor: [10, 10],
          })}
        >
          <Popup className="w-96">
            <div className="text-white rounded w-full" key={idx}>
              <div className="grid gap-1">
                <code>{v.name}</code>
                <p>Destination ➔ {v.headsgn}</p>
                <p>Speed ➔ {Math.round((v.sp || 0) * 3.6)} km/h</p>
                {v.delay ? (
                  <p className="text-muted-foreground">
                    Delay ➔{" "}
                    {parseInt(v.delay.toString()) > 0
                      ? v.delay + " min"
                      : "No delay!"}
                  </p>
                ) : null}
              </div>
              <div className="relative max-h-48 overflow-hidden" key={idx}>
                <style
                  dangerouslySetInnerHTML={{ __html: customScrollbarStyles }}
                />
                <div className="h-48 overflow-y-auto overflow-x-hidden custom-scrollbar">
                  <Table key={idx} className="w-full">
                    <TableHeader className="sticky top-0 bg-inherit z-10">
                      <TableRow className="*:text-center">
                        <TableHead>Állomás</TableHead>
                        <TableHead>Érk.</TableHead>
                        <TableHead>Ind.</TableHead>
                        <TableHead>Vágány</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody key={idx}>
                      {v.stops.map((s, idx) => {
                        return (
                          <TableRow
                            key={idx}
                            className={`${
                              (s.rd || 0) < nowInSec
                                ? "bg-green-500/10! transition-colors hover:bg-green-500/15!"
                                : null
                            }`}
                          >
                            <TableCell>{s.name}</TableCell>
                            <TableCell className="text-center">
                              {formatTime(s.sa!)}
                              <br />
                              <span className="text-xs text-red-500">
                                {formatTime((s.a || 0) + (s.sa || 0))}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {formatTime(s.sd!)}
                              <br />
                              <span className="text-xs text-red-500">
                                {formatTime((s.sd || 0) + (s.d || 0))}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {s.v ? s.v : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
