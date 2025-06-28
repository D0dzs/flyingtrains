"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#101010] rounded flex flex-col gap-0 items-center justify-center min-h-screen w-full">
      Loading map...
    </div>
  ),
});

const MapWrapper = ({
  trainData,
  isTrainLoading,
  trainError,
}: LeafletMapProps) => {
  return (
    <Map
      isTrainLoading={isTrainLoading}
      trainData={trainData}
      trainError={trainError}
    />
  );
};

export default MapWrapper;
