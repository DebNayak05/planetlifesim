import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={1}
                soilDisplacementScale={0}
                fresnelMultiplier={1}
                borderColor={0xffcc66}
                enableWater={false}
                percentageCloud={-1.2}
                cloudInnerRadiusMultiplier={1.17}
                cloudOuterRadiusMultiplier={1.25}
                cloudColorR={0.8}
                cloudColorG={0.7}
                cloudColorB={0}
                sunEmissionColor={0xFFE94B}
                sunShininess={1}

                radiusPlanet={14}
                massPlanet={146}
                massSun={1.03}
                orbitalRadius={0.0527}
            />
            <AboutPlanetSimulator planetName='Dimidium' />
        </div>
    )
}