import * as THREE from 'three'

const getSoilLayer= ({
index=0,
displacementScale=0.8,
soilRadius=2,
shininess=5,
}:{
index?:number
displacementScale?:number,
soilRadius?:number
shininess?:number
}={}) => {
    let loader = new THREE.TextureLoader();
    
    let dicDiffuse:{[key:number]: string} = {
      0:"../../textures/soil/Alpine/Alpine.png",
      1:"../../textures/soil/Dimidium/Dimidium.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e.png",
      4:"../../textures/soil/Kepler-452b/Kepler-452b.jpeg",
      5:"../../textures/soil/Proxima_Centauri-b/Proxima-b.jpeg",
      6:"../../textures/soil/HD-209458b/HD-209458b.png",
      7:"../../textures/soil/GJ-1214b/GJ-1214b.png"
    };


    let dicDisplacement:{[key:number]: string} = {
      0:"../../textures/soil/Alpine/Alpine_displacement.png",
      1:"../../textures/soil/Dimidium/Dimidium_displacement.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_displacement.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_displacement.png",
      4:"../../textures/soil/Kepler-452b/Kepler-452b_displacement.png",
      5:"../../textures/soil/Proxima_Centauri-b/Proxima-b_displacement.png",
      6:"../../textures/soil/HD-209458b/HD-209458b_displacement.png",
      7:"../../textures/soil/GJ-1214b/GJ-1214b_displacement.png"
    };

    let dicNormal:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_normal.png",
      1:"../../textures/soil/Dimidium/Dimidium_normal.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_normal.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_normal.png",
      4:"../../textures/soil/Kepler-452b/Kepler-452b_normal.png",
      5:"../../textures/soil/Proxima_Centauri-b/Proxima-b_normal.png",
      6:"../../textures/soil/HD-209458b/HD-209458b_normal.png",
      7:"../../textures/soil/GJ-1214b/GJ-1214b_normal.png"
    };

    let dicSpecular:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_specular.png",
      1:"../../textures/soil/Dimidium/Dimidium_specular.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_specular.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_specular.png",
      4:"../../textures/soil/Kepler-452b/Kepler-452b_specular.png",
      5:"../../textures/soil/Proxima_Centauri-b/Proxima_Centauri-b_specular.png",
      6:"../../textures/soil/HD-209458b/HD-209458b_specular.png",
      7:"../../textures/soil/GJ-1214b/GJ-1214b_specular.png"
    };

    let dicAmbient:{[key:number]:string} = {
      0:"../../textures/soil/Alpine/Alpine_ambient.png",
      1:"../../textures/soil/Dimidium/Dimidium_ambient.png",
      2:"../../textures/soil/Kepler-22b/Kepler-22b_ambient.png",
      3:"../../textures/soil/Trappist-1e/Trappist-1e_ambient.png",
      4:"../../textures/soil/Kepler-452b/Kepler-452b_ambient.png",
      5:"../../textures/soil/Proxima_Centauri-b/Proxima-b_ambient.png",
      6:"../../textures/soil/HD-209458b/HD-209458b_ambient.png",
      7:"../../textures/soil/GJ-1214b/GJ-1214b_ambient.png"
    };
    
    const soilDiffuse = loader.load(dicDiffuse[index]);
    const soilDisplacement = loader.load(dicDisplacement[index]);
    const soilNormal = loader.load(dicNormal[index]);
    const soilSpecular = loader.load(dicSpecular[index]);
    const soilAmbient = loader.load(dicAmbient[index]);

    const soilGeo = new THREE.SphereGeometry(soilRadius, 512, 512)
    const soilMat = new THREE.MeshPhongMaterial({
        map: soilDiffuse,
        displacementMap: soilDisplacement,
        displacementScale,
        normalMap: soilNormal,
        specularMap: soilSpecular,
        aoMap: soilAmbient,
        shininess: shininess,
      })
      const soilMesh = new THREE.Mesh(soilGeo, soilMat)
      return soilMesh;
};

export default getSoilLayer;