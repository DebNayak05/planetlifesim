import SpaceScene from '../../../components/SpaceScene'

export default function Simulator() {
    return (
        <div>
            <h1>Trappist-1e</h1>
            <SpaceScene
            soilIndex={3}
            soilDisplacementScale={0.5}
            waterColor={0x1e3f66}
            waterMultiplier={1.146}
            percentageCloud={0.35}
            cloudOuterRadiusMultiplier={1.6}
            borderColor={0xffffdd}
            sunEmissionColor={0xff0000}
            sunDistanceX={1000}
            lightColor={0xB06C55}
            />
        </div>
    )
}
