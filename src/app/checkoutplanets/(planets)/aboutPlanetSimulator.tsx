"use client";
import planetMap, { PlanetInfo } from "./planetInfo";
import { FaCirclePlus } from "react-icons/fa6";
import { dummyPlanetInfo } from "./planetInfo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AboutPlanet from "@/components/ui/aboutPlanet";
import Link  from "next/link";

export default function AboutPlanetSimulator({
  planetName,
}: {
  planetName: string;
}) {
  const planetInfo: PlanetInfo = planetMap.get(planetName) ?? dummyPlanetInfo;
  return (
    <div>
      <div className="cursor-pointer fixed bottom-6 left-6 z-50 rounded-2xl border border-white/20 px-7 py-4 text-white hover:scale-105 transition-transform duration-200 justify-center text-center items-center backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_0_10px_rgba(255,255,255,1)]">
        <Dialog>
          <DialogTrigger className="text-2xl font-extrabold cursor-pointer flex flex-row justify-center items-center text-center gap-2">
            <span>
              {planetName.replace("_", " ").toUpperCase()}
            </span>
            <FaCirclePlus className="text-violet-400" size={22}/>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="text-3xl font-bold text-center text-gray-900 dark:text-white items-center">
              {planetName.replace("_", " ").toUpperCase()}
            </DialogHeader>
            <AboutPlanet planetInfo={planetInfo} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="cursor-pointer fixed bottom-6 right-6 z-50 rounded-2xl border border-white/20 px-7 py-4 text-white hover:scale-105 transition-transform duration-200 justify-center text-center items-center backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_0_10px_rgba(255,255,255,0.6)]">
        <Link href="/checkoutplanets" className="block w-full h-full">
          Back To Menu
        </Link>
      </div>
    </div>
    
  );
}
