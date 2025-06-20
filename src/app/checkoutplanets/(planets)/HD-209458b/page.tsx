import SpaceScene from '@/components/SpaceScene'
import AboutPlanetSimulator from '../aboutPlanetSimulator'
export default function Simulator() {
    return (
        <div>
            <SpaceScene
            soilIndex={6}
            soilDisplacementScale={0}
            enableWater={false}
            // enableCloud={false}
            percentageCloud={-2.2}
            cloudInnerRadiusMultiplier={1.17}
            cloudOuterRadiusMultiplier={1.25}
            borderColor={0xffffdd}
            cloudColorR={0.5}
            cloudColorG={0.5}
            cloudColorB={0.5}
            sunDistanceX={900}
            sunEmissionColor={0xFFEA33}
            // currentPreset_='dense'
            fresnelMultiplier={1}
            />
            <AboutPlanetSimulator planetName='HD-209458b'/>
        </div>
    )
}