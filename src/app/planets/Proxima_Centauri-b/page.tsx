import SpaceScene from '../../../components/SpaceScene'

export default function Simulator() {
    return (
        <div>
            <h1>Proxima Centauri-b</h1>
            <SpaceScene
            soilIndex={5}
            soilDisplacementScale={0.2}
            enableWater={false}
            percentageCloud={0.40}
            cloudOuterRadiusMultiplier={1.6}
            cloudColorR={0.49}
            cloudColorG={0.2}
            cloudColorB={0}
            borderColor={0xffffdd}
            fresnelMultiplier={1.07}
            sunEmissionColor={0xff0000}
            sunDistanceX={700}
            lightColor={0xB06C55}
            />
        </div>
    )
}