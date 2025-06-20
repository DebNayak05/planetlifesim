import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={3}
                soilDisplacementScale={0.5}
                waterColor={0x1e3f66}
                waterMultiplier={1.146}
                percentageCloud={0.35}
                cloudOuterRadiusMultiplier={1.6}
                borderColor={0xffffdd}
                sunEmissionColor={0xff0000}
                // lightColor={0xB06C55}

                radiusPlanet={0.92}
                massPlanet={0.692}
                massSun={0.0898}
                orbitalRadius={0.02925}
            />
            <AboutPlanetSimulator planetName='Trappist-1e'/>
        </div>
    )
}
