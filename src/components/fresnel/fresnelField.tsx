import * as THREE from "three";

interface FresnelMatOptions {
  rimHex?: number;
  facingHex?: number;
  fresnelMultiplier?: number;
  soilRadius?:number;
}

interface FresnelUniforms {
  color1: { value: THREE.Color };
  color2: { value: THREE.Color };
  fresnelBias: { value: number };
  fresnelScale: { value: number };
  fresnelPower: { value: number };
  [key: string]: { value: unknown }; // Add this index signature
}

function getFresnelMat({ 
  rimHex = 0x0088ff, 
  facingHex = 0x000000,
  fresnelMultiplier = 1.17,
  soilRadius = 2
}: FresnelMatOptions = {}) {
 
    const geometry = new THREE.SphereGeometry(soilRadius*fresnelMultiplier,512,512);
    
  const uniforms: FresnelUniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };

  const vs: string = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
      vec3 I = worldPosition.xyz - cameraPosition;
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fs: string = `
    uniform vec3 color1;
    uniform vec3 color2;
    varying float vReflectionFactor;

    void main() {
      float f = clamp( vReflectionFactor, 0.0, 1.0 );
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
  `;

  const fresnelMat: THREE.ShaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
    // wireframe: true,
  });

  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  return glowMesh;
}

export default getFresnelMat;
