import SpaceScene from '../../../components/SpaceScene'

export default function Simulator() {
    return (
        <div>
            <h1>Kepler-22b</h1>
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
        </div>
    )
}
