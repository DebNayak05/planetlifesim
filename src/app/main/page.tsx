import Sim from '@/components/StarHabitability'
import SpaceScene from '../../components/SpaceScene'
import * as THREE from 'three'

const c = new THREE.Color(1,1,0)

export default function Simulator() {
    return (
        <div>
            <h1>Simulator</h1>
            {/* <SpaceScene  
            soilDisplacementScale={0.8} 
            cloudColorG={0} 
            waterColor={0x00ff00}
            sunDistanceX={500}
            sunEmissionColor={0xf23e07}
            sunShininess={0.4}/> */}
            <Sim/>
        </div>
    )
}