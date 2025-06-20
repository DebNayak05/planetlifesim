import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={6}
                soilDisplacementScale={0}
                enableWater={false}
                // enableCloud={false}
                percentageCloud={-2.2}
                cloudInnerRadiusMultiplier={1.17}
                cloudOuterRadiusMultiplier={1.32}
                borderColor={0xffffdd}
                cloudColorR={0.7}
                cloudColorG={0.7}
                cloudColorB={0.7}
                sunEmissionColor={0xFFEA33}
                // currentPreset_='dense'
                fresnelMultiplier={1}

                radiusPlanet={15.2530219201}
                massPlanet={231.9729}
                massSun={1.23}
                orbitalRadius={0.04707}
            />
            <AboutPlanetSimulator planetName='HD-209458b'/>
        </div>
    )
}