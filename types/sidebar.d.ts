import { Dispatch, SetStateAction } from "react";

interface AppSidebarProps {
  totalDelay: number;
  lastUpdated: number;
  vehicles: ProcessedVehicle[];
  handleTechnologiesDialogOpen: any;
  handleAboutDialogOpen: any;
}