import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={4}
                soilDisplacementScale={0.5}
                waterColor={0x1e3f66}
                waterMultiplier={1.11}
                percentageCloud={0.3}
                cloudOuterRadiusMultiplier={1.6}
                borderColor={0xffffdd}
                sunEmissionColor={0xFFE94B}
                sunShininess={1}

                radiusPlanet={1.63}
                massPlanet={3.29}
                massSun={1.037}
                orbitalRadius={1.046}
            />
            <AboutPlanetSimulator planetName='Kepler-452b' />
        </div>
    )
}