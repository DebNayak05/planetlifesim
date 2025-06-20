import SpaceScene from '@/components/SpaceScene'
import AboutPlanetSimulator from '../aboutPlanetSimulator'
export default function Simulator() {
    return (
        <div>
            <SpaceScene
            soilIndex={2}
            waterIndex={6}
            waterColor={0x008080}
            waterMultiplier={1.159}
            waterOpacity={0.7}
            waterShininess={150}
            waterReflectivity={0.8}
            cloudOuterRadiusMultiplier={1.6}
            percentageCloud={0.45}
            borderColor={0xffffdd}
            sunEmissionColor={0xFFE94B}
            sunDistanceX={1000}
            sunShininess={1}
            />
            <AboutPlanetSimulator planetName='Kepler-22b'/>
        </div>
    )
}
