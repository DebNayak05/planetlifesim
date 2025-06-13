"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import createStars from './StarField';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
      orbitalControl.maxDistance = 100
      orbitalControl.minDistance = 3
      
      // Created Basic Earth like sphere
      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4488ff,
        shininess: 30,
        transparent: true,
        opacity: 0.9
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

      // Create a group to hold both sphere and additional texture layers 
      // TODO: Add layers
      const planetGroup = new THREE.Group();
      planetGroup.add(sphere);
      scene.add(planetGroup);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(-1, 1, 1);
      scene.add(directionalLight);

      // Position camera
      camera.position.z = 8;

      // state variable
      let isKeyPressed = false;
      let isWobbling = true;

      const onKeyDown = (event:KeyboardEvent) => {
        if(event.key == 'w' && !isKeyPressed)
        {
          isKeyPressed = true;
          if(!isWobbling)
          {
            isWobbling = true;
          }
          else
          {
            isWobbling = false;
          }
        }
      }

      const onKeyUp = (event:KeyboardEvent) => {
        if(event.key == 'm')
        {
          isKeyPressed = false;
        }
        if(event.key == 'w')
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
        // stars.rotation.x += 0.0001;
        // stars.rotation.y += 0.0002;
        
        // Add subtle floating animation to planet when not dragging
        // if (!isDragging && isWobbling) {
        //   planetGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        // }
        
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
        sphereGeometry.dispose();
        sphereMaterial.dispose();
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