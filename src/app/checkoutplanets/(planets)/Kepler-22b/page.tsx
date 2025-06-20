import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={2}
                waterIndex={6}
                waterColor={0x008080}
                waterMultiplier={1.159}
                waterOpacity={0.7}
                waterShininess={150}
                waterReflectivity={0.8}
                cloudOuterRadiusMultiplier={1.6}
                percentageCloud={0.4}
                borderColor={0xffffdd}
                sunEmissionColor={0xFFE94B}
                sunShininess={1}

                radiusPlanet={2.1}
                massPlanet={9.1}
                massSun={0.857}
                orbitalRadius={0.812}
            />
            <AboutPlanetSimulator planetName='Kepler-22b'/>
        </div>
    )
}
