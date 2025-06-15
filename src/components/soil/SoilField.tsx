import * as THREE from 'three'
import { vec2 } from 'three/tsl';

const getSoilLayer= (index: number = 0) => {
    const R=2;
    let loader = new THREE.TextureLoader();
    
    let dicDiffuse:{[key:number]: string} = {
      0:"../../textures/soil/Alpine/Alpine.png"
    };


    let dicDisplacement:{[key:number]: string} = {
      0:"../../textures/soil/Alpine/Alpine_displacement.png"
    };

    let dicNormal:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_normal.png"
    };

    let dicSpecular:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_specular.png"
    };

    let dicAmbient:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_ambient.png"
    };
    

    const soilDiffuse = loader.load(dicDiffuse[index]);
    const soilDisplacement = loader.load(dicDisplacement[index]);
    const soilNormal = loader.load(dicNormal[index]);
    const soilSpecular = loader.load(dicSpecular[index]);
    const soilAmbient = loader.load(dicAmbient[index]);

    const soilGeo = new THREE.SphereGeometry(R, 128, 128)
    const soilMat = new THREE.MeshPhongMaterial({
        map: soilDiffuse,
        displacementMap: soilDisplacement,
        displacementScale:0.8,
        normalMap: soilNormal,
        specularMap: soilSpecular,
        aoMap: soilAmbient,
        shininess: 5,
      })
      const soilMesh = new THREE.Mesh(soilGeo, soilMat)
      return soilMesh;
};

export default getSoilLayer;