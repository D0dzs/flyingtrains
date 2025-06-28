"use client";

import { Brain, ClockAlert, CpuIcon, RssIcon, TrainFront } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { AppSidebarProps } from "~/types/sidebar";

export function AppSidebar({
  totalDelay,
  lastUpdated,
  vehicles,
  handleTechnologiesDialogOpen,
  handleAboutDialogOpen,
}: Readonly<AppSidebarProps>) {
  const hours = Math.floor(totalDelay / 3600);
  const minutes = Math.floor((totalDelay % 3600) / 60);

  const openGithubRepository = () => {
    window.open("https://github.com/D0dzs/flyingtrains", "_blank", "noopener noreferrer");
  };

  return (
    <Sidebar className="h-screen w-64 bg-[#101010] text-white">
      <SidebarHeader>
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <Image
            src={"/sitelogo.webp"}
            alt="Site Logo (AI generated)"
            width={90}
            height={90}
            className="rounded-full outline-2 outline-[#3a3633]/80"
          />
          <h1 className="font-mono text-xl">Flying Trains</h1>
        </div>
        <hr className="border-gray-700" />
      </SidebarHeader>
      <SidebarContent className="justify-center p-4">
        <SidebarGroup className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <RssIcon size={24} className="stroke-emerald-400" />
              <span>
                {lastUpdated > 0 ? (
                  <p>
                    {new Date(lastUpdated).toLocaleString("hu-HU", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500 italic">
              (Updates every 3 minutes!)
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <ClockAlert size={24} className="stroke-orange-400" />
            <span>
              {totalDelay > 0 ? (
                <p>
                  Global delay: <b>{hours.toString().padStart(2, "0")}</b>h{" "}
                  <b>{minutes.toString().padStart(2, "0")}</b>m
                </p>
              ) : (
                "Loading..."
              )}
            </span>
          </div>
          <div className="flex flex-row gap-2">
            <TrainFront size={24} className="stroke-white" />
            <span>
              {vehicles.length > 0 ? (
                <p>
                  Currently tracking <b>{vehicles.length}</b> trains.
                </p>
              ) : (
                "Counting..."
              )}
            </span>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={handleAboutDialogOpen}
            >
              <Brain /> About
            </SidebarMenuButton>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={handleTechnologiesDialogOpen}
            >
              <CpuIcon />
              Technologies
            </SidebarMenuButton>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={openGithubRepository}
            >
              <p className="w-full text-center">Made with ❤️ on GitHub</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
