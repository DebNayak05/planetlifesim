"use client";
import SpaceScene from "@/components/SpaceScene";
import Link from "next/link";
import Image from "next/image";
import planetMap, { PlanetInfo } from "./planetInfo";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { dummyPlanetInfo } from "./planetInfo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AboutPlanet from "@/components/ui/aboutPlanet";
export default function AboutPlanetSimulator({
  planetName,
}: {
  planetName: string;
}) {
  const planetInfo: PlanetInfo = planetMap.get(planetName) ?? dummyPlanetInfo;
  return (
    <div>
      {/* <div className="fixed bottom-6 left-6 z-50 rounded-full bg-white text-black shadow-lg p-3 hover:scale-105 transition-transform duration-200 justify-center text-center items-center"> */}
      <div className="cursor-pointer fixed bottom-6 max-w-3/12 max-h-1/12 left-6 z-50 rounded-2xl bg-gradient-to-r from-white/5 to-white/15 border border-white/20 px-7 py-4 text-white shadow-xl hover:scale-105 transition-transform duration-200 justify-center text-center items-center backdrop-blur-2xl">
        <Dialog>
          <DialogTrigger className="text-2xl font-extrabold cursor-pointer">
            {planetName.replace("_", " ").toUpperCase()}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="text-3xl font-bold text-center text-gray-900 dark:text-white items-center">
              {planetName}
            </DialogHeader>
            <AboutPlanet planetInfo={planetInfo} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
