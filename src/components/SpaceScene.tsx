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
  soilRadius,
  soilIndex,
  soilDisplacementScale,
  soilShininess,
  waterIndex,
  waterColor,
  waterMultiplier,
  waterOpacity,
  waterShininess,
  waterReflectivity,
  cloudInnerRadiusMultiplier,
  cloudOuterRadiusMultiplier,
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
      orbitalControl.mouseButtons.RIGHT = null;
  
      
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

      // Cleanup function
      return () => {
        // Remove event listeners
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('resize', handleResize);
        
        // Cancel animation
        cancelAnimationFrame(animationId);
        
        // Clean up Three.js resources
        // sphereGeometry.dispose();
        // sphereMaterial.dispose();
        stars.geometry.dispose();
        (stars.material as THREE.Material).dispose();
            
        renderer.dispose();
        
        // Remove canvas from DOM
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

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
