import * as THREE from 'three'

export default function getSunLayer({
    radius = 200, 
    emissionColor = 0xFBE12D, 
    shine= 0.9, 
}:{
    radius?:number,
    emissionColor?:number,
    shine?:number, 
} ={}) {
    const tex = new THREE.TextureLoader().load("../../textures/sun/genericType_grayscale.png")

    const sunGeo = new THREE.SphereGeometry(radius, 2048, 2048);
    const sunMat = new THREE.MeshPhongMaterial({
            emissiveMap: tex,
            emissive:emissionColor,
            emissiveIntensity:shine,
            transparent:false,
            depthWrite:true,
            depthTest:true,
            opacity: 1
          })
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);;
    return sunMesh; 
   
}