import SpaceScene from "./SpaceScene";
import AboutPlanetSimulator from "../aboutPlanetSimulator";
export default function Simulator() {
  return (
    <div>
      <SpaceScene />
      <AboutPlanetSimulator planetName="Trappist-1e" />
    </div>
  );
}
