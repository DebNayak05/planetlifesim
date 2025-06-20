import SpaceScene from '@/components/SpaceScene'
import AboutPlanetSimulator from '../aboutPlanetSimulator'
export default function Simulator() {
    return (
        <div>
            <SpaceScene
            soilIndex={7}
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
            sunEmissionColor={0xff0000}
            sunDistanceX={850}
            // lightColor={0xB06C55}
            fresnelMultiplier={1}
            />
            <AboutPlanetSimulator planetName='GJ-1214b'/>
        </div>
    )
}