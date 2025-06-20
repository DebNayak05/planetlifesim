import SpaceScene from '@/components/SpaceScene'
import AboutPlanetSimulator from '../aboutPlanetSimulator'
export default function Simulator() {
    return (
        <div>
            <SpaceScene
            soilIndex={4}
            soilDisplacementScale={0.5}
            waterColor={0x1e3f66}
            waterMultiplier={1.11}
            percentageCloud={0.35}
            cloudOuterRadiusMultiplier={1.6}
            borderColor={0xffffdd}
            sunEmissionColor={0xFFE94B}
            sunDistanceX={900}
            sunShininess={1}
            />
            <AboutPlanetSimulator planetName='Kepler-452b' />
        </div>
    )
}