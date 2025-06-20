import SpaceScene from '../../../components/SpaceScene'

export default function Simulator() {
    return (
        <div>
            <h1>Dimidium</h1>
            <SpaceScene
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
                sunDistanceX={1000}
                sunShininess={1}
            />
        </div>
    )
}