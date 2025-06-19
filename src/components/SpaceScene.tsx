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

const SpaceScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      // orbitalControl.enableDamping = true;
      // orbitalControl.dampingFactor = 0.05;

      // Soil Layer
      const soilMesh = getSoilLayer();

      //Water Layer
      const waterMesh = getWaterLayer({index:6});

      //Cloud Layer
      const {cloudMaterial_, cloudQuad} = getCloudLayer({camera_:camera,cloudInnerRadius:3.0,cloudOuterRadius:3.25, percentageCloud:0.35,currentPreset_:"random", cloudColor:new THREE.Color(1,1,1)});
      
      //Fresnel Layer
      const glowLayer = getFresnelMat({radius:2.35, rimHex:0xffffdd});

      // Sun Layer
      const sunMesh = getSunLayer({shine:0.8, radius:200, color:0xf23e07});
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);

      // Create a group to hold both sphere and additional texture layers 
      // TODO: Add layers
      const planetGroup = new THREE.Group();
      planetGroup.add(soilMesh);
      planetGroup.add(waterMesh);
      planetGroup.add(cloudQuad);
      planetGroup.add(glowLayer);
      scene.add(planetGroup);

      scene.add(sunMesh);
      scene.add(directionalLight);
      
      // Min - 400 and Max -1100
      sunMesh.position.set(1100,5,0); //Keep both of them same
      directionalLight.position.set(1100, 5, 0);
      
      
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

export default SpaceScene;