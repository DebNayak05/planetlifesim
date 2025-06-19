import * as THREE from 'three'

export default function getSunLayer({radius = 10, color = 0xFBE12D, shine= 0.3, lightIntensity = 0.5}:{radius?:number,color?:number,shine?:number, lightIntensity?:number} ={}) {
    const tex = new THREE.TextureLoader().load("../../textures/sun/genericType_grayscale.png")

    const sunGeo = new THREE.SphereGeometry(radius, 2048, 2048);
    const sunMat = new THREE.MeshPhongMaterial({
            emissiveMap: tex,
            color:color,
            emissive:color,
            emissiveIntensity:shine,
            transparent:false,
          })
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);;
  
  return sunMesh;
    
}