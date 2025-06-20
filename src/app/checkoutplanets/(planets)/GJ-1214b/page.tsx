import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={7}
                soilDisplacementScale={0}
                enableWater={false}
                percentageCloud={-2.2}
                cloudInnerRadiusMultiplier={1.17}
                cloudOuterRadiusMultiplier={1.25}
                borderColor={0xffffdd}
                cloudColorR={0.5}
                cloudColorG={0.5}
                cloudColorB={0.5}
                sunEmissionColor={0xff0000}
                fresnelMultiplier={1}

                radiusPlanet={2.6755594598}
                massPlanet={8.41}
                massSun={0.182}
                orbitalRadius={0.01505}
            />
            <AboutPlanetSimulator planetName='GJ-1214b'/>
        </div>
    )
}