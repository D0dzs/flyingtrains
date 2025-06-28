"use client";

import { useTrainDataQuery } from "~/hooks/useTrainData";
import MapWrapper from "./Map";

import { AlertOctagonIcon, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useState } from "react";
import { AppSidebar } from "./Sidebar";
import { Dialog } from "~/components/ui/dialog";
import AboutDialog from "./Dialogs/AboutDialog";
import TechnologiesDialog from "./Dialogs/TechnologiesDialog";

const HomePage = () => {
  const [alertBoxVisible, setAlertBoxVisibility] = useState(true);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [technologiesDialogOpen, setTechnologiesDialogOpen] = useState(false);

  const handleAboutDialogOpen = () => setAboutDialogOpen((prev) => !prev);
  const handleTechnologiesDialogOpen = () =>
    setTechnologiesDialogOpen((prev) => !prev);
  const hideAlertBox = () => {
    setAlertBoxVisibility((prev) => !prev);
  };

  const {
    data: trainData,
    isLoading: isTrainLoading,
    error: trainError,
  } = useTrainDataQuery();

  let { totalDelay, lastUpdated, vehicles }: ApiResponse = trainData || {};
  // let { totalDelay, lastUpdated, vehicles }: ApiResponse = {
  //   lastUpdated: Date.now(),
  //   totalDelay: 28422,
  //   vehicles: [{ stops: [], id: "12345", name: "Train 123" }],
  // };

  if (vehicles === undefined) vehicles = [];

  return (
    <div className="relative grid grid-cols-1 h-screen">
      <Dialog
        open={aboutDialogOpen}
        onOpenChange={setAboutDialogOpen}
        children={<AboutDialog />}
      />
      <Dialog
        open={technologiesDialogOpen}
        onOpenChange={handleTechnologiesDialogOpen}
        children={<TechnologiesDialog />}
      />
      <div className="absolute md:bottom-4! top-4 h-fit right-4 z-999 p-4 outline-2 outline-[#333333]/80 bg-[#101010]/80 text-white rounded shadow-lg backdrop-blur-[2px] font-mono">
        <h1 className="text-center mb-2">Legend</h1>
        <div className="grid gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-950 rounded-full" />
            &gt;= 90 minutes delay
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            &gt;= 60 minutes delay
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full" />
            &gt;= 15 minutes delay
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            &gt;= 05 minutes delay
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-lime-500 rounded-full" />
            &gt;= 00 minutes delay
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 outline-[#333333]/80 bg-[#101010]/80 py-1 px-2 rounded-[0px_0px_0px_4px] text-xs gap-1 hidden md:flex z-9999">
        <span className="flex items-center gap-1">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            className="leaflet-attribution-flag"
          >
            <path fill="#4C7BE1" d="M0 0h12v4H0z"></path>
            <path fill="#FFD500" d="M0 4h12v3H0z"></path>
            <path fill="#E0BC00" d="M0 7h12v1H0z"></path>
          </svg>{" "}
          <a
            href="https://leafletjs.com/"
            className="text-sky-400 transition-colors hover:text-sky-300 underline font-mono"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leaflet
          </a>
        </span>{" "}
        | &copy;{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          className="text-sky-400 transition-colors hover:text-sky-300 underline font-mono"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </div>
      <AppSidebar
        lastUpdated={lastUpdated}
        totalDelay={totalDelay}
        vehicles={vehicles}
        handleTechnologiesDialogOpen={handleTechnologiesDialogOpen}
        handleAboutDialogOpen={handleAboutDialogOpen}
      />
      <MapWrapper
        isTrainLoading={isTrainLoading}
        trainData={trainData}
        trainError={trainError}
      />
      {alertBoxVisible ? (
        <Alert
          className="hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2 md:w-max z-9999 outline-[#333333]/80 bg-[#101010]/80 backdrop-blur-[2px]"
          variant="default"
        >
          <AlertOctagonIcon className="stroke-red-400" />
          <AlertTitle className="flex items-center justify-between">
            <p className="text-red-400">Heads up!</p>
            <X size={14} cursor={"pointer"} onClick={hideAlertBox} />
          </AlertTitle>
          <AlertDescription>
            <p>
              This website is not affiliated with, endorsed by, or in any way
              officially connected with{" "}
              <a
                href="https://www.mavcsoport.hu/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-red-400 font-mono transition-colors hover:text-red-300">
                  MÁV Magyar Államvasutak Zrt.
                </span>
              </a>
              , or any of its subsidiaries or affiliates.
              <br /> The website is forked on the original project{" "}
              <a
                href="https://holavonat.hu/"
                className="text-sky-400 transition-colors hover:text-sky-300 underline font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                holavonat.hu
              </a>
              !
            </p>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default HomePage;
