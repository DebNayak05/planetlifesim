"use client";
import SpaceScene from "./SpaceScene";
import AboutPlanetSimulator from "../aboutPlanetSimulator";
export default function PlanetPage() {
  return (
    <div>
      <SpaceScene />
      <AboutPlanetSimulator planetName="Kepler-22b" />
    </div>
  );
}
