import * as THREE from 'three';

const getWaterLayer = ({
    index=0, 
    newColor=0xffffff,
    soilRadius=2,
    waterMultiplier=1.17, 
    newOpacity=0.5, 
    newShininess=1000, 
    newReflectivity=0.4,
}: {
    index?: number, 
    newColor?: number,
    soilRadius?:number,
    waterMultiplier?: number, 
    newOpacity?: number, 
    newShininess?:number, 
    newReflectivity?:number
} = {}) => {
    let loader = new THREE.TextureLoader();

    let dic: { [key: number]: string }  = { 
        0:"../../textures/water/normal/water1.jpg",
        1:"../../textures/water/normal/water2.jpg",
        2:"../../textures/water/normal/water3.jpg",
        3:"../../textures/water/normal/water4.jpg",
        4:"../../textures/water/normal/water5.jpg",
        5:"../../textures/water/normal/water6.jpg",
        6:"../../textures/water/normal/water7.jpg",
        7:"../../textures/water/normal/water8.jpg",
        8:"../../textures/water/normal/water9.jpg",
        9:"../../textures/water/normal/water10.jpg",
        10:"../../textures/water/normal/water11.jpg",
        11:"../../textures/water/normal/water12.jpg"
    };

    const waterNormal = loader.load(dic[index]);

    const waterGeo = new THREE.SphereGeometry(soilRadius *waterMultiplier, 512, 512)
    const waterMat = new THREE.MeshPhongMaterial({
        color: newColor,
        transparent: true,
        opacity: newOpacity,
        shininess: newShininess,
        normalMap:waterNormal,
        reflectivity: newReflectivity,
      })

    const waterMesh = new THREE.Mesh(waterGeo, waterMat)
    return waterMesh;
};

export default getWaterLayer;