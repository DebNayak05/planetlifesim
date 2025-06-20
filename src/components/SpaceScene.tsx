"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import createStars from './StarField';
import getSoilLayer from './soil/SoilField';
import getWaterLayer from './water/WaterField';
import getCloudLayer from './cloud/CloudField';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getFresnelMat  from './fresnel/fresnelField';
import getSunLayer from './sun/sun';

let Gtime = 0;
let cloudRotation = 0.0;

export default function SpaceScene({
  soilRadius=2,
  soilIndex,
  soilDisplacementScale,
  soilShininess,
  waterIndex,
  waterColor,
  waterMultiplier,
  waterOpacity,
  waterShininess,
  waterReflectivity,
  cloudInnerRadiusMultiplier=1.5,
  cloudOuterRadiusMultiplier=1.8,
  percentageCloud,
  currentPreset_,
  cloudColorR=1,
  cloudColorG=1,
  cloudColorB=1,
  borderColor,
  facingColor,
  fresnelMultiplier,
  sunRadius,
  sunEmissionColor,
  sunShininess,
  sunDistanceX=400,
  lightColor=0xffffff,
  lightIntensity=2,

  enableSoil=true,
  enableWater=true,
  enableCloud = true,
  enableFresnel = true
}:{
  soilRadius?:number,
  soilIndex?:number,
  soilDisplacementScale?:number,
  soilShininess?:number,
  waterIndex?:number,
  waterColor?:number,
  waterMultiplier?:number,
  waterOpacity?:number,
  waterShininess?:number,
  waterReflectivity?:number,
  cloudInnerRadiusMultiplier?:number,
  cloudOuterRadiusMultiplier?:number,
  percentageCloud?:number,
  currentPreset_?:string,
  cloudColorR?:number
  cloudColorG?:number
  cloudColorB?:number
  borderColor?:number,
  facingColor?:number,
  fresnelMultiplier?:number,
  sunRadius?:number,
  sunEmissionColor?:number,
  sunShininess?:number,
  sunDistanceX?:number,
  lightColor?:number,
  lightIntensity?:number,

  enableSoil?:boolean,
  enableWater?:boolean,
  enableCloud?:boolean,
  enableFresnel?:boolean
  }={}){
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudColor = new THREE.Color(cloudColorR, cloudColorG, cloudColorB)

  const sceneRef = useRef<THREE.Scene>(null);
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const cloudMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const orbitalControlRef = useRef<OrbitControls>(null);
  const cameraRef = useRef<THREE.Camera>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000011); // Dark space blue
      containerRef.current.appendChild(renderer.domElement);

      // Create starfield background
      const stars = createStars();
      scene.add(stars);

      // Created orbitalControl for planet
      const orbitalControl = new OrbitControls(camera, renderer.domElement);
      orbitalControl.maxDistance = 100;
      orbitalControl.minDistance = 5;

      // Soil Layer
      const soilMesh = getSoilLayer({soilRadius:soilRadius, index:soilIndex, displacementScale:soilDisplacementScale, shininess:soilShininess});

      //Water Layer
      const waterMesh = getWaterLayer({index:waterIndex, soilRadius:soilRadius, newColor:waterColor,waterMultiplier:waterMultiplier,newOpacity:waterOpacity,newShininess:waterShininess,newReflectivity:waterReflectivity});

      //Cloud Layer
      const {cloudMaterial_, cloudQuad} = getCloudLayer({camera_:camera,cloudInnerRadiusMultiplier:cloudInnerRadiusMultiplier,cloudOuterRadiusMultiplier:cloudOuterRadiusMultiplier, percentageCloud:percentageCloud,currentPreset_:currentPreset_, cloudColor:cloudColor,soilRadius:soilRadius});
      
      //Fresnel Layer
      const glowLayer = getFresnelMat({fresnelMultiplier:fresnelMultiplier, rimHex:borderColor,facingHex:facingColor,soilRadius:soilRadius});

      // Sun Layer
      const sunMesh = getSunLayer({shine:sunShininess, radius:sunRadius, emissionColor:sunEmissionColor, });
      const directionalLight = new THREE.DirectionalLight(lightColor, lightIntensity);

      // Create a group to hold both sphere and additional texture layers 
      // TODO: Add layers
      const planetGroup = new THREE.Group();
      if(enableSoil){
        planetGroup.add(soilMesh);
      }
      if(enableWater){
        planetGroup.add(waterMesh);
      }
      if(enableCloud) {
        planetGroup.add(cloudQuad);
      }
      if(enableFresnel) {
        planetGroup.add(glowLayer);
      }
      scene.add(planetGroup);

      scene.add(sunMesh);
      scene.add(directionalLight);
      
      // Min - 400 and Max -1100
      sunMesh.position.set(sunDistanceX,5,0); //Keep both of them same
      directionalLight.position.set(sunDistanceX, 5, 0);
      
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x202020, 0.2);
      scene.add(ambientLight);
      


      // Position camera
      camera.position.z = 8;

      // state variable
      let isKeyPressed = false;
      let isWobbling = false;

      const onKeyDown = (event:KeyboardEvent) => { // first key is toggled then checked which key
        if (!isKeyPressed) {
          isKeyPressed = true;
        }
      }

      const onKeyUp = (event:KeyboardEvent) => { // add key lift instruction/condition first then this 
        if(isKeyPressed)
        {
          isKeyPressed = false;
        }
      }

      //Refrences
      sceneRef.current = scene;
      sunMeshRef.current = sunMesh;
      directionalLightRef.current = directionalLight;
      cloudMaterialRef.current = cloudMaterial_;
      orbitalControlRef.current = orbitalControl;
      cameraRef.current = camera

      // Added Names
    soilMesh.name = 'soilMesh';
    waterMesh.name = 'waterMesh';
    cloudQuad.name = 'cloudQuad';
    glowLayer.name = 'glowLayer';
    sunMesh.name = 'sunMesh';
    planetGroup.name = 'planetGroup';

    // Store references to materials that need updating
    cloudMaterial_.name = 'cloudMaterial';

      // Add event listeners
      window.addEventListener('keydown',onKeyDown)
      window.addEventListener('keyup',onKeyUp)
      
      // Animation loop
      let animationId: number;
      
      const animate = () => { //TODO Add layers rotation
        // Slowly rotate stars for space effect
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0002;
        planetGroup.rotation.y += 0.002
        sunMesh.rotation.y += 0.002

        Gtime += 0.01
        camera.updateMatrix();
        if(cloudMaterial_ && directionalLight)
        {
          const rotationSpeed = 0.005;
          const cameraDistance = camera.position.length();
          const dynamicCoverage = THREE.MathUtils.mapLinear(
              cameraDistance,
              2.0, 7.0,    // Distance range (close to far)
              0.2, 0.8    // Coverage range (sparse to dense)
              );
          const frustumHeight = 2.0 * Math.tan((camera.fov * Math.PI / 180) / 2.0) * cameraDistance;
          
          cloudRotation -= rotationSpeed;

          cloudMaterial_.uniforms.u_weatherScale.value = 0.8 + Math.sin(Gtime * 0.1) * 0.2;
          cloudMaterial_.uniforms.u_weatherStrength.value = 0.7 + Math.sin(Gtime * 0.05) * 0.2;
          cloudMaterial_.uniforms.u_cloudClumping.value = 0.6 + Math.sin(Gtime * 0.08) * 0.3;
          
          // ===============================
          // UPDATE CORE UNIFORMS
          // ===============================
          cloudMaterial_.uniforms.u_time.value = Gtime;
          cloudMaterial_.uniforms.u_cloudRotation.value = cloudRotation;
          cloudMaterial_.uniforms.u_cameraPos.value.copy(camera.position);
          cloudMaterial_.uniforms.u_cameraWorldMatrix.value.copy(camera.matrixWorld);
          cloudMaterial_.uniforms.u_sunDirection.value.copy(directionalLight.position).normalize();
          cloudMaterial_.uniforms.u_cloudCover.value = Math.max(0.1, Math.min(0.9, dynamicCoverage));
          cloudMaterial_.uniforms.u_cameraFrustumSize.value = frustumHeight;
        }

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Proper cleanup function
      return () => {
        // Cancel animation frame first
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        // Remove all event listeners
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('resize', handleResize);

        // Dispose of orbital controls
        if (orbitalControl) {
          orbitalControl.dispose();
        }

        // Traverse scene and dispose all geometries and materials
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            // Dispose geometry
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            // Dispose materials (handle both single and array)
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });

        // Dispose specific objects from your scene
        if (stars) {
          if (stars.geometry) stars.geometry.dispose();
          if (stars.material) {
            if (Array.isArray(stars.material)) {
              stars.material.forEach(material => material.dispose());
            } else {
              stars.material.dispose();
            }
          }
        }

        // Dispose cloud material specifically
        if (cloudMaterial_) {
          cloudMaterial_.dispose();
        }

        // Dispose cloud quad if it exists
        if (cloudQuad) {
          if (cloudQuad.geometry) cloudQuad.geometry.dispose();
          if (cloudQuad.material) {
            if (Array.isArray(cloudQuad.material)) {
              cloudQuad.material.forEach(material => material.dispose());
            } else {
              cloudQuad.material.dispose();
            }
          }
        }

        // Dispose planet group objects
        if (soilMesh) {
          if (soilMesh.geometry) soilMesh.geometry.dispose();
          if (soilMesh.material) soilMesh.material.dispose();
        }
        
        if (waterMesh) {
          if (waterMesh.geometry) waterMesh.geometry.dispose();
          if (waterMesh.material) waterMesh.material.dispose();
        }
        
        if (glowLayer) {
          if (glowLayer.geometry) glowLayer.geometry.dispose();
          if (glowLayer.material) glowLayer.material.dispose();
        }

        if (sunMesh) {
          if (sunMesh.geometry) sunMesh.geometry.dispose();
          if (sunMesh.material) sunMesh.material.dispose();
        }

        // Dispose renderer and clear WebGL context
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
          if (containerRef.current && renderer?.domElement && containerRef.current.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement);
          }
        }

        // Remove canvas from DOM safely
        if (containerRef.current && renderer?.domElement && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }

        // Clear scene completely
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        // Clear any remaining references
        scene.clear();
      };

    }
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Update planet group scale based on soilRadius
    const planetGroup = sceneRef.current.getObjectByName('planetGroup') as THREE.Group;
    if (planetGroup) {
      const scale = Math.max(Math.min((soilRadius/2),10),1); // 2 is your base radius
      console.log("scale: " + scale.toString());
      // const scale = soilRadius / 2;
      planetGroup.scale.setScalar(scale);
    }

    if(orbitalControlRef.current)
    {
      orbitalControlRef.current.minDistance = soilRadius*(5/2);
    }

    // Update sun position and light position
    if (sunMeshRef.current && directionalLightRef.current) {
      sunMeshRef.current.position.setX(Math.max(Math.min(sunDistanceX,1100),400));
      directionalLightRef.current.position.setX(Math.max(Math.min(sunDistanceX,1100),400));
      directionalLightRef.current.intensity = lightIntensity;
    }

    // Update cloud coverage
    if (cloudMaterialRef.current?.uniforms) {
      cloudMaterialRef.current.uniforms.u_cloudCover.value = percentageCloud;
    }

  //     if (cloudMaterialRef.current?.uniforms && cameraRef.current) {
    // const cloudInnerRadius = (Math.min((soilRadius / 2),10)) * cloudInnerRadiusMultiplier * cloudInnerRadiusMultiplier; // Use your multipliers
    // const cloudOuterRadius = cloudInnerRadius + (cloudOuterRadiusMultiplier - cloudInnerRadiusMultiplier);
    
  //   // Update the uniform values directly
  //   cloudMaterialRef.current.uniforms.u_cloudInnerRadius.value = cloudInnerRadius;
  //   cloudMaterialRef.current.uniforms.u_cloudOuterRadius.value = cloudOuterRadius;

  //   cloudMaterialRef.current.uniforms.u_cameraPos.value.copy(cameraRef.current.position);
    
  //   // Update frustum size for LOD
  //   const cameraDistance = cameraRef.current.position.length();
  //   const frustumHeight = 2.0 * Math.tan((75 * Math.PI / 180) / 2.0) * cameraDistance;
  //   cloudMaterialRef.current.uniforms.u_cameraFrustumSize.value = frustumHeight;
  // }

  if (cloudMaterialRef.current?.uniforms) {
    let radiusChangedTo = Math.max(Math.min((soilRadius),10),2);
    const cloudInnerRadius =  radiusChangedTo * cloudInnerRadiusMultiplier; // Use your multipliers
    const cloudOuterRadius = cloudInnerRadius + ( cloudOuterRadiusMultiplier - cloudInnerRadiusMultiplier);
    console.log("innerradius: " + cloudInnerRadius.toString());
    console.log("changed radius: " + radiusChangedTo.toString());
    // const cloudInnerRadius = Math.max(Math.min((soilRadius),10),1) * cloudInnerRadiusMultiplier;
    // const cloudOuterRadius = Math.max(Math.min((soilRadius),10),1) * cloudOuterRadiusMultiplier;
    
    // Update cloud volume bounds
    cloudMaterialRef.current.uniforms.u_cloudInnerRadius.value = cloudInnerRadius;
    cloudMaterialRef.current.uniforms.u_cloudOuterRadius.value = cloudOuterRadius;
    
    // Update coverage
    cloudMaterialRef.current.uniforms.u_cloudCover.value = percentageCloud;
    
    // Force LOD recalculation by updating camera position
    // if (cameraRef.current) {
    //   cloudMaterialRef.current.uniforms.u_cameraPos.value.copy(cameraRef.current.position);
    // }
  }


  }, [soilRadius, sunDistanceX, percentageCloud, lightIntensity, cloudInnerRadiusMultiplier, cloudOuterRadiusMultiplier]);


  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        cursor: 'grab',
        userSelect: 'none'
      }} 
    />
  );
};
