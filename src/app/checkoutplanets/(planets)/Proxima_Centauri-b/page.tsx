import AboutPlanetSimulator from '../aboutPlanetSimulator'
import Sim from '@/components/StarHabitability'
export default function Simulator() {
    return (
        <div>
            <Sim
                soilIndex={5}
                soilDisplacementScale={0.2}
                enableWater={false}
                percentageCloud={0.30}
                cloudInnerRadiusMultiplier={1.4}
                cloudOuterRadiusMultiplier={1.6}
                // cloudColorR={0.49}
                // cloudColorG={0.2}
                // cloudColorB={0}
                borderColor={0xffffdd}
                fresnelMultiplier={1.07}
                sunEmissionColor={0xff0000}
                // lightColor={0xB06C55}

                radiusPlanet={1.03}
                massPlanet={1.07}
                massSun={0.1221}
                orbitalRadius={0.04856}
            />
            <AboutPlanetSimulator planetName='Proxima_Centauri-b'/>
        </div>
    )
}