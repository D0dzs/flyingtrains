"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const AboutDialog = () => {
  return (
    <DialogContent className="z-999999">
      <DialogHeader>
        <DialogTitle>About</DialogTitle>
        <DialogDescription className="text-justify">
          <span className="text-red-400 font-bold">
            It is not affiliated with any official railway company or
            organization!
          </span>
          <br />
          The site (<span className="text-sky-300">Flying Trains</span>) is a
          self-driven project that aims to provide real-time tracking of
          Hungarian trains. We have used{" "}
          <a
            href="https://emma.mav.hu/otp2-backend/otp/routers/default/index/graphql"
            target="_blank"
            className="text-sky-400 transition-colors hover:text-sky-300 underline font-mono"
            rel="noopener noreferrer"
          >
            Open-Source Data
          </a>{" "}
          to track the trains and its' positions,{" "}
          <span className="">We are not slowing down the system</span>, as we
          refresh the data{" "}
          <code className="text-red-300 font-extrabold">every 2 minutes</code>!
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default AboutDialog;
