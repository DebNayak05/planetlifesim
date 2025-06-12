"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

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
      const createStars = () => {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
        
        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
          const x = (Math.random() - 0.5) * 2000;
          const y = (Math.random() - 0.5) * 2000;
          const z = (Math.random() - 0.5) * 2000;
          starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
        return stars;
      };

      const stars = createStars();

      // Create planet/sphere with grid markings
      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
      
      // Create earth-like texture with basic materials
      const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4488ff,
        shininess: 30,
        transparent: true,
        opacity: 0.9
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

      // Add grid lines for rotation visualization
      const createGridLines = () => {
        const gridGroup = new THREE.Group();
        
        // Longitude lines (vertical)
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const curve = new THREE.EllipseCurve(0, 0, 2.01, 2.01, 0, Math.PI * 2, false, 0);
          const points = curve.getPoints(50);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
          const line = new THREE.Line(geometry, material);
          
          line.rotation.y = angle;
          line.rotation.x = Math.PI / 2;
          gridGroup.add(line);
        }
        
        // Latitude lines (horizontal)
        for (let i = 1; i < 6; i++) {
          const lat = (i / 6) * Math.PI - Math.PI / 2;
          const radius = Math.cos(lat) * 2.01;
          const y = Math.sin(lat) * 2.01;
          
          const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
          const points = curve.getPoints(50);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 });
          const line = new THREE.Line(geometry, material);
          
          line.position.y = y;
          gridGroup.add(line);
        }
        
        return gridGroup;
      };

      // Add colored markers at key positions
      const createMarkers = () => {
        const markerGroup = new THREE.Group();
        
        // North pole marker (red)
        const northGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const northMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const northPole = new THREE.Mesh(northGeometry, northMaterial);
        northPole.position.set(0, 2.1, 0);
        markerGroup.add(northPole);
        
        // South pole marker (blue)
        const southGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const southMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const southPole = new THREE.Mesh(southGeometry, southMaterial);
        southPole.position.set(0, -2.1, 0);
        markerGroup.add(southPole);
        
        // Equator markers (green)
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 2.1;
          const z = Math.sin(angle) * 2.1;
          
          const markerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
          const markerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
          const marker = new THREE.Mesh(markerGeometry, markerMaterial);
          marker.position.set(x, 0, z);
          markerGroup.add(marker);
        }
        
        // Add a distinctive "continent" shape
        const continentGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const continentMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const continent = new THREE.Mesh(continentGeometry, continentMaterial);
        continent.position.set(2.05, 0.5, 0);
        markerGroup.add(continent);
        
        return markerGroup;
      };

      const gridLines = createGridLines();
      const markers = createMarkers();
      
      // Create a group to hold both sphere and markings
      const planetGroup = new THREE.Group();
      planetGroup.add(sphere);
      planetGroup.add(gridLines);
      planetGroup.add(markers);
      scene.add(planetGroup);
      // scene.add

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(-1, 1, 1);
      scene.add(directionalLight);

      // Position camera
      camera.position.z = 8;

      // Mouse interaction variables
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      const rotationSpeed = 0.005;

      // state variable
      let isKeyPressed = false;
      let isMarkerToggle = true;
      let isWobbling = true;

      // Mouse event handlers
      const onMouseDown = (event: MouseEvent) => {
        isDragging = true;
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      };

      const onMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;

        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        // Rotate planet group based on mouse movement
        planetGroup.rotation.y += deltaMove.x * rotationSpeed;
        planetGroup.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      // Touch event handlers for mobile
      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 1) {
          isDragging = true;
          previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          };
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        if (!isDragging || event.touches.length !== 1) return;
        
        event.preventDefault();
        
        const deltaMove = {
          x: event.touches[0].clientX - previousMousePosition.x,
          y: event.touches[0].clientY - previousMousePosition.y
        };

        planetGroup.rotation.y += deltaMove.x * rotationSpeed;
        planetGroup.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      };

      const onTouchEnd = () => {
        isDragging = false;
      };

      const onKeyDown = (event:KeyboardEvent) => {
        if(event.key == 'm' && !isKeyPressed)
        {
          isKeyPressed = true;
          if(!isMarkerToggle)
          {
            gridLines.visible = true;
            markers.visible = true;
            isMarkerToggle = true;
          }
          else
          {
            gridLines.visible = false;
            markers.visible = false;
            isMarkerToggle = false;
          }
        }
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
      renderer.domElement.addEventListener('mousedown', onMouseDown);
      window.addEventListener('keydown',onKeyDown)
      window.addEventListener('keyup',onKeyUp)
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      
      renderer.domElement.addEventListener('touchstart', onTouchStart);
      renderer.domElement.addEventListener('touchmove', onTouchMove);
      renderer.domElement.addEventListener('touchend', onTouchEnd);

      // Animation loop
      let animationId: number;
      
      const animate = () => {
        // Slowly rotate stars for space effect
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0002;
        
        // Add subtle floating animation to planet when not dragging
        if (!isDragging && isWobbling) {
          planetGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
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
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', handleResize);
        
        // Cancel animation
        cancelAnimationFrame(animationId);
        
        // Clean up Three.js resources
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        stars.geometry.dispose();
        (stars.material as THREE.Material).dispose();
        
        // Clean up grid lines and markers
        gridLines.children.forEach(child => {
          if (child instanceof THREE.Line || child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        
        markers.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        
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