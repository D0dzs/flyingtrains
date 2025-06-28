import { Analytics } from "@vercel/analytics/next";
import { BotIdClient } from "botid/client";

import type { Metadata } from "next";
import TSQueryProvider from "./components/Providers/TSQueryProvider";
import { SidebarProvider } from "~/components/ui/sidebar";
import "./globals.css";

const ProtectedRoutes = [
  { path: "/api/boundary", method: "GET" },
  { path: "/api/railways/main", method: "GET" },
  { path: "/api/railways/standard", method: "GET" },
  { path: "/api/train-data", method: "GET" },
];

export const metadata: Metadata = {
  icons: {
    icon: "favicon.png",
  },
  authors: [{ name: "Dodzs" }],
  title: "Flying trains - Real-time train tracking in Hungary",
  description:
    "Track Hungary's trains in real-time with this app. Stay informed about delays! Powered by the public MÁV API (<3). Everyone has the right to know — even if they're sitting 300 km away from the train.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <BotIdClient protect={ProtectedRoutes} />
      </head>
      <body className={`antialiased dark select-none overflow-hidden`}>
        <TSQueryProvider>
          <SidebarProvider>
            <main className="w-full h-screen relative">
              {children}
              <Analytics />
            </main>
          </SidebarProvider>
        </TSQueryProvider>
      </body>
    </html>
  );
}
