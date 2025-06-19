import * as THREE from 'three'
import { vec2 } from 'three/tsl';

const getSoilLayer= (index: number = 0,displacementScale: number = 0.8) => {
    const R=2;
    let loader = new THREE.TextureLoader();
    
    let dicDiffuse:{[key:number]: string} = {
      0:"../../textures/soil/Alpine/Alpine.png",
      1:"../../textures/soil/Dimidium/Dimidium.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e.png"
    };


    let dicDisplacement:{[key:number]: string} = {
      0:"../../textures/soil/Alpine/Alpine_displacement.png",
      1:"../../textures/soil/Dimidium/Dimidium_displacement.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_displacement.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_displacement.png"
    };

    let dicNormal:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_normal.png",
      1:"../../textures/soil/Dimidium/Dimidium_normal.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_normal.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_normal.png"
    };

    let dicSpecular:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_specular.png",
      1:"../../textures/soil/Dimidium/Dimidium_specular.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_specular.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_specular.png"
    };

    let dicAmbient:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_ambient.png",
      1:"../../textures/soil/Dimidium/Dimidium_ambient.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_ambient.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_ambien.png"
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
        displacementScale,
        normalMap: soilNormal,
        specularMap: soilSpecular,
        aoMap: soilAmbient,
        shininess: 5,
      })
      const soilMesh = new THREE.Mesh(soilGeo, soilMat)
      return soilMesh;
};

export default getSoilLayer;