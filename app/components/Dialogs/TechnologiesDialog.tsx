"use client";

import Image from "next/image";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const TechnologiesDialog = () => {
  return (
    <DialogContent className="z-999999">
      <DialogHeader>
        <DialogTitle>Technologies</DialogTitle>
        <DialogDescription>
          <div className="flex flex-wrap justify-around items-center *:w-32 *:h-24 *:opacity-70 *:has-hover:opacity-100 *:transition-all">
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center "
            >
              <Image
                src={"/tech/NextJS.svg"}
                width={32}
                height={32}
                alt="NextJS"
              />
              <span>Next.js</span>
            </a>
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center"
            >
              <Image
                src={"/tech/TailwindCSS.svg"}
                width={32}
                height={32}
                alt="NextJS"
              />
              <p>TailwindCSS V4</p>
            </a>
            <a
              href="https://leafletjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center"
            >
              <Image
                src={"/tech/Leaflet.svg"}
                width={32}
                height={32}
                alt="NextJS"
              />
              <p>Leaflet (map)</p>
            </a>
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center"
            >
              <Image
                src={"/tech/Shadcn-ui.svg"}
                width={32}
                height={32}
                alt="NextJS"
              />
              <p>Shadcn/ui</p>
            </a>
            <a
              href="https://lucide.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center"
            >
              <Image
                src={"/tech/Lucid-React.svg"}
                width={32}
                height={32}
                alt="NextJS"
              />
              <p>Lucid-React (icons)</p>
            </a>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default TechnologiesDialog;
