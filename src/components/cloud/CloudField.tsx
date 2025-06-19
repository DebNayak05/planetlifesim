import * as THREE from 'three';

const cloudPresets_:{[key: string]: {
    seed1: number;
    seed2: number;
    seed3: number;
  }} = {
    'cumulus': { seed1: 12345, seed2: 67890, seed3: 11111 },  // Fluffy, puffy clouds
    'stratus': { seed1: 54321, seed2: 98765, seed3: 22222 },  // Layered, sheet-like clouds
    'storm': { seed1: 13579, seed2: 24680, seed3: 33333 },    // Dramatic storm systems
    'wispy': { seed1: 97531, seed2: 86420, seed3: 44444 },    // Thin, cirrus-like clouds
    'dense': { seed1: 19283, seed2: 37465, seed3: 55555 },    // Heavy, overcast coverage
    'random': {seed1:10000, seed2:99999, seed3: 99999}   
};

function getVertexShader_() {
        return `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;  // Pass UV coordinates to fragment shader
                // Position vertices in normalized device coordinates (-1 to 1)
                gl_Position = vec4(position, 1.0);
            }
        `;
    }

function getFragmentShader_() {
        return `
            precision highp float;

            // ===============================
            // SHADER UNIFORMS
            // ===============================
            // Cloud shape controls
            uniform float u_weatherScale;      // Size of weather patterns
            uniform float u_weatherStrength;   // Weather influence strength
            uniform float u_cloudClumping;     // Worley noise clumping factor
            
            // Camera and rendering
            uniform vec3 u_cameraPos;          // Camera world position
            uniform mat4 u_cameraWorldMatrix;  // Camera transformation
            uniform float u_time;              // Global animation time
            uniform vec2 u_resolution;         // Screen resolution
            
            // Lighting
            uniform vec3 u_sunDirection;       // Sun direction vector
            uniform vec3 u_sunColor;           // Sun light color
            uniform vec3 u_ambientColor;       // Ambient light color
            uniform vec3 u_cloudBaseColor; // Color

            
            // Cloud volume
            uniform float u_cloudInnerRadius;  // Inner cloud boundary
            uniform float u_cloudOuterRadius;  // Outer cloud boundary
            uniform float u_cloudCover;        // Overall coverage amount
            uniform float u_cameraFrustumSize; // For LOD calculations
            
            // Seed-based pattern system
            uniform float u_noiseSeed1;        // Base pattern seed
            uniform float u_noiseSeed2;        // Detail pattern seed
            uniform float u_noiseSeed3;        // Weather pattern seed
            uniform float u_seedTransition;    // Transition interpolation factor
            uniform float u_nextSeed1;         // Target base pattern seed
            uniform float u_nextSeed2;         // Target detail pattern seed
            uniform float u_nextSeed3;         // Target weather pattern seed
            uniform float u_percentageCloud;   // Weather threshold control

            uniform float u_cloudRotation;


            varying vec2 vUv; // UV coordinates from vertex shader


            vec3 rotateY(vec3 p, float angle) {
            float c = cos(angle);
            float s = sin(angle);
            return vec3(
                c * p.x + s * p.z,
                p.y,
                -s * p.x + c * p.z
            );
        }


            // ===============================
            // RAY MARCHING CONSTANTS
            // ===============================
            const int MAX_STEPS = 32;      // Maximum ray marching steps (quality vs performance)
            const float STEP_SIZE = 0.025; // Base step size

            // ===============================
            // SEEDED NOISE GENERATION SYSTEM
            // ===============================
            
            /**
             * Seeded Hash Function
             * Generates pseudo-random values from 3D coordinates and a seed
             * Critical for reproducible cloud patterns
             */
            vec3 seededHash33(vec3 p3, float seed) {
                // Ensure input is in proper range [0,1]
                p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
                
                // Integrate seed into hash calculation
                float seedOffset = fract(seed * 0.001);
                p3 += vec3(seedOffset, seedOffset * 1.1, seedOffset * 1.3);
                p3 += dot(p3, p3.yxz + 33.33);
                
                vec3 result = fract((p3.xxy + p3.yxx) * p3.zyx);
                
                // CRITICAL: Ensure output is always in [0,1] range
                return clamp(result, 0.0, 1.0);
            }

            /**
             * Seeded 3D Noise Function
             * Creates smooth 3D noise using the seeded hash function
             * Forms the basis of all cloud patterns
             */
            float seededNoise(vec3 p, float seed) {
                vec3 i = floor(p);  // Integer part (grid coordinates)
                vec3 f = fract(p);  // Fractional part (position within grid cell)
                
                // Smooth interpolation (smoothstep)
                f = f * f * (3.0 - 2.0 * f);
                
                // Sample 8 corners of the current grid cube
                vec3 h000 = seededHash33(i + vec3(0.0, 0.0, 0.0), seed);
                vec3 h100 = seededHash33(i + vec3(1.0, 0.0, 0.0), seed);
                vec3 h010 = seededHash33(i + vec3(0.0, 1.0, 0.0), seed);
                vec3 h110 = seededHash33(i + vec3(1.0, 1.0, 0.0), seed);
                vec3 h001 = seededHash33(i + vec3(0.0, 0.0, 1.0), seed);
                vec3 h101 = seededHash33(i + vec3(1.0, 0.0, 1.0), seed);
                vec3 h011 = seededHash33(i + vec3(0.0, 1.0, 1.0), seed);
                vec3 h111 = seededHash33(i + vec3(1.0, 1.0, 1.0), seed);
                
                // Extract noise values (use first component)
                float a = h000.x; float b = h100.x; float c = h010.x; float d = h110.x;
                float e = h001.x; float f2 = h101.x; float g = h011.x; float h = h111.x;
                
                // Trilinear interpolation
                float result = mix(
                    mix(mix(a, b, f.x), mix(c, d, f.x), f.y),      // Bottom face
                    mix(mix(e, f2, f.x), mix(g, h, f.x), f.y),     // Top face
                    f.z                                            // Between faces
                );
                
                return clamp(result, 0.0, 1.0); // Guarantee [0,1] range
            }

            /**
             * Fractal Brownian Motion (FBM) with Seeded Noise
             * Combines multiple octaves of noise for complex cloud shapes
             * Each octave adds detail at different scales
             */
            float seededFbm(vec3 p, int octaves, float seed) {
                float value = 0.0;      // Accumulated noise value
                float amplitude = 0.5;   // Starting amplitude (strength of each octave)
                float frequency = 1.0;   // Starting frequency (scale of each octave)
                float maxValue = 0.0;    // Track maximum possible value for normalization
                
                // Generate multiple octaves of noise
                for(int i = 0; i < 6; i++) {
                    if(i >= octaves) break;
                    
                    // Use well-separated seeds for each octave to avoid correlation
                    float octaveSeed = seed + float(i) * 137.0;
                    float noiseValue = seededNoise(p * frequency, octaveSeed);
                    
                    value += amplitude * noiseValue;
                    maxValue += amplitude;
                    
                    amplitude *= 0.5;  // Each octave has half the amplitude (standard FBM)
                    frequency *= 2.0;  // Each octave has double the frequency (more detail)
                }
                
                // Normalize by maximum possible value to ensure [0,1] range
                if (maxValue > 0.0) {
                    value /= maxValue;
                }
                
                return clamp(value, 0.0, 1.0);
            }

            /**
             * Seeded Worley Noise (Cellular Noise)
             * Creates cellular patterns for cloud clumping
             * Simulates how clouds naturally form in separated masses
             */
            vec2 seededWorley(vec3 p, float seed) {
                vec3 id = floor(p);  // Current cell ID
                vec3 fd = fract(p);  // Position within cell
                
                float minDist = 1.0;  // Distance to closest point
                float secDist = 1.0;  // Distance to second closest point
                
                // Check 3x3x3 neighborhood of cells
                for(int x = -1; x <= 1; x++) {
                    for(int y = -1; y <= 1; y++) {
                        for(int z = -1; z <= 1; z++) {
                            vec3 coord = vec3(float(x), float(y), float(z));
                            vec3 rId = id + coord;
                            
                            // Generate random point in this cell using seeded hash
                            vec3 hash = seededHash33(rId, seed);
                            vec3 point = coord + hash - fd;
                            float d = length(point);
                            
                            // Track two closest distances for better patterns
                            if(d < minDist) {
                                secDist = minDist;
                                minDist = d;
                            } else if(d < secDist) {
                                secDist = d;
                            }
                        }
                    }
                }
                
                // Normalize distances to [0,1] range
                // Maximum possible distance in 3x3x3 grid is sqrt(3) ≈ 1.732
                minDist = clamp(minDist / 1.732, 0.0, 1.0);
                secDist = clamp(secDist / 1.732, 0.0, 1.0);
                
                return vec2(minDist, secDist);
            }

            /**
             * ===============================
             * COORDINATE SYSTEM UTILITIES
             * ===============================
             */
            
            /**
             * Spherical to Cartesian Coordinate Conversion
             * Fixes polar singularities that cause artifacts at planet poles
             * Uses cube projection to avoid mathematical singularities
             */
            vec3 sphericalToCartesian(vec3 pos) {
                float r = length(pos);
                vec3 n = normalize(pos);
                
                vec3 absN = abs(n);
                float maxCoord = max(max(absN.x, absN.y), absN.z);
                
                // Project onto dominant axis to avoid pole issues
                if (maxCoord == absN.x) {
                    return vec3(n.x, n.y / absN.x, n.z / absN.x) * r;
                } else if (maxCoord == absN.y) {
                    return vec3(n.x / absN.y, n.y, n.z / absN.y) * r;
                } else {
                    return vec3(n.x / absN.z, n.y / absN.z, n.z) * r;
                }
            }

            /**
             * ===============================
             * CLOUD DISTRIBUTION FUNCTIONS
             * ===============================
             */
            
            /**
             * Height Gradient Function
             * Controls vertical distribution of clouds within the atmosphere
             * Creates realistic density falloff at top and bottom of cloud layer
             */
            float getHeightGradient(float height_fraction) {
                return smoothstep(0.0, 0.1, height_fraction) *    // Fade in from bottom
                       smoothstep(1.0, 0.7, height_fraction);     // Fade out at top
            }

            /**
             * Seeded Weather Map Generation
             * Creates large-scale weather patterns that control where clouds can form
             * This is the primary control for overall cloud distribution
             */
            float getSeededWeatherMap(vec3 p, float seed) {
                // Convert to spherical coordinates to avoid pole artifacts
                vec3 sphericalPos = sphericalToCartesian(p);
                vec3 weatherPos = sphericalPos * u_weatherScale;
                weatherPos += vec3(u_time * 0.0002); // Very slow evolution
                
                // Generate base weather pattern using FBM
                float weather = seededFbm(weatherPos, 3, seed);
                
                // Add latitude-based variation (Earth-like weather bands)
                vec3 n = normalize(p);
                float latitude = clamp(asin(n.y), -1.0, 1.0); // Ensure valid range for asin
                float latitudeEffect = sin(latitude * 4.0) * 0.5 + 0.5; // Map to [0,1]
                
                weather = mix(weather, latitudeEffect, 0.1);
                
                // Apply threshold to determine where clouds can form
                // u_percentageCloud controls this threshold - lower values = fewer clouds
                return smoothstep(u_percentageCloud, 0.8, weather);
            }

            /**
             * ===============================
             * MAIN CLOUD DENSITY CALCULATION
             * ===============================
             * Combines all noise patterns to determine final cloud density
             * This is where all the magic happens!
             */
            float getCloudDensity(vec3 p) {
                p = rotateY(p, u_cloudRotation);

                // Calculate position within cloud layer (0 = inner, 1 = outer)
                float height_fraction = (length(p) - u_cloudInnerRadius) /
                                      (u_cloudOuterRadius - u_cloudInnerRadius);
                
                // Early exit if outside cloud layer
                if(height_fraction < 0.0 || height_fraction > 1.0) return 0.0;
                
                // Apply height-based distribution
                float heightGrad = getHeightGradient(height_fraction);
                if(heightGrad < 0.01) return 0.0; // Early exit for areas with no vertical cloud potential
                
                // Convert coordinates and add slow animation
                vec3 sphericalPos = sphericalToCartesian(p);
                vec3 cloudPos = sphericalPos * 1.5 + vec3(u_time * 0.001);
                
                // ===============================
                // GENERATE BASE CLOUD PATTERNS
                // ===============================
                // Generate patterns using both current and target seeds
                float baseNoise1 = seededFbm(cloudPos, 4, u_noiseSeed1);
                float baseNoise2 = seededFbm(cloudPos, 4, u_nextSeed1);
                // Interpolate between patterns during transitions
                float baseNoise = mix(baseNoise1, baseNoise2, clamp(u_seedTransition, 0.0, 1.0));
                
                // ===============================
                // ADD DETAIL TEXTURE (WORLEY NOISE)
                // ===============================
                // Worley noise creates the clumpy, cellular structure of clouds
                vec2 worleyResult1 = seededWorley(cloudPos * 0.8, u_noiseSeed2);
                vec2 worleyResult2 = seededWorley(cloudPos * 0.8, u_nextSeed2);
                
                float detail1 = 1.0 - worleyResult1.x; // Invert distance for density
                float detail2 = 1.0 - worleyResult2.x;
                float detail = mix(detail1, detail2, clamp(u_seedTransition, 0.0, 1.0));
                
                // ===============================
                // APPLY WEATHER CONTROL
                // ===============================
                // Weather map determines large-scale cloud distribution
                float weather1 = getSeededWeatherMap(p, u_noiseSeed3);
                float weather2 = getSeededWeatherMap(p, u_nextSeed3);
                float weather = mix(weather1, weather2, clamp(u_seedTransition, 0.0, 1.0));
                
                // ===============================
                // COMBINE ALL LAYERS
                // ===============================
                float density = baseNoise;
                
                // Mix in detail based on clumping parameter
                density = mix(density, density * detail, u_cloudClumping * 0.5);
                
                // Apply weather and height influence
                density *= weather * u_weatherStrength;
                density *= heightGrad;
                
                // ===============================
                // APPLY FINAL COVERAGE THRESHOLD
                // ===============================
                // This determines how much of the noise becomes visible clouds
                float coverage = clamp(u_cloudCover, 0.0, 1.0);
                density = smoothstep(1.0 - coverage - 0.1, 1.0 - coverage + 0.5, density);
                
                return clamp(density, 0.0, 1.0);
            }

            /**
             * ===============================
             * RAY-SPHERE INTERSECTION
             * ===============================
             * Mathematical function to find where a ray intersects a sphere
             * Essential for ray marching through the spherical cloud volume
             */
            vec2 raySphereIntersect(vec3 ro, vec3 rd, float r) {
                float b = dot(ro, rd);                    // Ray-sphere dot product
                float c = dot(ro, ro) - r * r;           // Distance from origin to sphere
                float discriminant = b * b - c;          // Quadratic discriminant
                
                if (discriminant < 0.0) return vec2(-1.0); // No intersection
                
                float h = sqrt(discriminant);
                return vec2(-b - h, -b + h); // Entry and exit distances
            }

            /**
             * ===============================
             * ATMOSPHERIC LIGHTING CALCULATION
             * ===============================
             * Simulates realistic light scattering through clouds
             * Includes direct lighting, atmospheric scattering, and shadow casting
             */
            float getApproximateLighting(vec3 p, vec3 sun_dir, float quality) {
                vec3 planet_to_point = normalize(p);      // Direction from planet center to sample point
                vec3 planet_to_sun = normalize(sun_dir);  // Direction from planet center to sun
                float dot_product = dot(planet_to_point, planet_to_sun); // Angle between them
                
                // ===============================
                // DAY/NIGHT TERMINATOR
                // ===============================
                // Smooth transition between day and night sides
                float terminator = smoothstep(-0.8, 0.6, dot_product);
                
                // ===============================
                // LIGHTING COMPONENTS
                // ===============================
                // Direct sunlight (strongest on sun-facing side)
                float direct_light = smoothstep(-0.6, 0.8, dot_product);
                
                // Ambient light (minimal in space)
                float ambient_light = 0.2 * smoothstep(-0.7, 0.3, dot_product);
                
                // Rim lighting (atmospheric glow at planet edges)
                float rim_light = pow(1.0 - abs(dot_product), 1.0) * 0.3;
                
                // ===============================
                // ATMOSPHERIC SCATTERING
                // ===============================
                // Simulates light scattering through atmosphere
                float scatter1 = smoothstep(-1.0, 0.2, dot_product) * 0.08; // Primary scattering
                float scatter2 = smoothstep(-0.9, 0.1, dot_product) * 0.05; // Secondary scattering
                
                // ===============================
                // SHADOW CALCULATION
                // ===============================
                // Check if this point is shadowed by clouds between it and the sun
                vec3 shadow_pos = p + sun_dir * 0.1; // Step towards sun
                float shadow_dist = length(shadow_pos);
                float shadow = 1.0; // Start with no shadow
                
                if (shadow_dist <= u_cloudOuterRadius && shadow_dist >= u_cloudInnerRadius) {
                    // Point is within cloud layer - check cloud density
                    float shadow_density = getCloudDensity(shadow_pos);
                    shadow = exp(-shadow_density * 1.0); // Exponential shadow falloff
                } else if (shadow_dist < u_cloudInnerRadius) {
                    shadow = 0.4; // Behind planet - partial shadow for gradual transition
                }
                
                // ===============================
                // COMBINE ALL LIGHTING
                // ===============================
                float totalLight = (direct_light + ambient_light + rim_light + scatter1 + scatter2) * shadow;
                
                return totalLight * terminator; // Apply day/night terminator
            }

            /**
             * ===============================
             * MAIN FRAGMENT SHADER
             * ===============================
             * The main rendering loop - performs ray marching through cloud volume
             */
            void main() {
                // ===============================
                // RAY SETUP
                // ===============================
                // Generate ray from camera through current pixel
                vec2 screenPos = vUv * 2.0 - 1.0; // Convert UV to screen space [-1, 1]
                vec3 rayDir = normalize(vec3(screenPos * vec2(u_resolution.x / u_resolution.y, 1.0), -1.0));
                rayDir = (u_cameraWorldMatrix * vec4(rayDir, 0.0)).xyz; // Transform to world space
                vec3 rayOrigin = u_cameraPos;
                
                // ===============================
                // LOD (LEVEL OF DETAIL) SYSTEM
                // ===============================
                // Adjust quality based on camera distance for performance
                float camera_to_volume_dist = max(0.0, length(u_cameraPos) - u_cloudOuterRadius);
                float lod_factor = smoothstep(0.0, 12.0, camera_to_volume_dist); // Wider range
                
                // Fewer steps when far away, more when close
                int adaptive_steps = int(mix(16.0, float(MAX_STEPS), lod_factor * lod_factor)); // Quadratic falloff
                float quality_factor = mix(0.7, 1.0, lod_factor);

                
                // ===============================
                // RAY-VOLUME INTERSECTION
                // ===============================
                // Find where ray enters and exits cloud volume
                vec2 outerIntersection = raySphereIntersect(rayOrigin, rayDir, u_cloudOuterRadius);
                vec2 innerIntersection = raySphereIntersect(rayOrigin, rayDir, u_cloudInnerRadius);
                
                // Early exit if ray misses cloud volume entirely
                if (outerIntersection.x < 0.0) {
                    discard;
                    return;
                }
                
                // ===============================
                // DETERMINE RAY MARCHING BOUNDS
                // ===============================
                float rayStart = max(0.0, outerIntersection.x);  // Start at cloud layer entry
                float rayEnd = outerIntersection.y;              // End at cloud layer exit
                
                // Clip against planet surface (can't see clouds behind planet)
                if (innerIntersection.x > 0.0 && innerIntersection.x < rayEnd) {
                    rayEnd = innerIntersection.x;
                }
                
                // Validate ray segment
                if (rayStart >= rayEnd) {
                    discard;
                    return;
                }
                
                // ===============================
                // RAY MARCHING LOOP
                // ===============================
                // March through cloud volume, sampling density and accumulating color
                vec4 color = vec4(0.0);                           // Accumulated color and opacity
                float totalDistance = rayEnd - rayStart;          // Total distance to march
                float stepSize = totalDistance / float(adaptive_steps); // Size of each step
                
                bool foundClouds = false; // Debug flag
                
                // March through the volume
                for(int i = 0; i < MAX_STEPS; i++) {
                    if (i >= adaptive_steps) break; // Respect LOD step limit
                    
                    // Calculate current sample position
                    float t = rayStart + float(i) * stepSize;
                    vec3 p = rayOrigin + t * rayDir;
                    
                    // Sample cloud density at this position
                    float density = getCloudDensity(p);
                    
                    if (density > 0.01) { // Only process if there's significant density
                        foundClouds = true;
                        
                        // Calculate lighting for this sample
                        float light_value = getApproximateLighting(p, u_sunDirection, quality_factor);
                        vec3 cloud_color = u_cloudBaseColor; // Use red base color
                        vec3 light_at_sample = mix(u_ambientColor, u_sunColor * cloud_color, light_value);
                        
                        // Skip samples that are too dark (optimization)
                        if (light_value < 0.01) {
                            continue;
                        }
                        
                        // ===============================
                        // VOLUME INTEGRATION
                        // ===============================
                        // Accumulate color and opacity using volume rendering equation
                        float alpha_step = density * stepSize * 12.0 * quality_factor;
                        color.rgb += light_at_sample * alpha_step * (1.0 - color.a); // Front-to-back blending
                        color.a += alpha_step * (1.0 - color.a);
                        
                        // Early ray termination for performance
                        if (color.a > 0.95) break;
                    }
                }
                
                // Final output
                gl_FragColor = color;
            }
        `;
    }


const  getCloudLayer = ({
    camera_, 
    currentPreset_ = 'storm',
    percentageCloud = 0.2, 
    cloudColor = new THREE.Color(1.0, 1.0, 1.0), 
    cloudInnerRadiusMultiplier = 1.5, 
    cloudOuterRadiusMultiplier = 1.8,
    soilRadius=2
}:{
    camera_: THREE.PerspectiveCamera, 
    currentPreset_?: string, 
    percentageCloud?: number, 
    cloudColor?: THREE.Color, 
    cloudInnerRadiusMultiplier? : number, 
    cloudOuterRadiusMultiplier?: number,
    soilRadius?:number
}) => {

    // Use a full-screen quad for ray marching (the shader does all the 3D work)
    const cloudGeometry = new THREE.PlaneGeometry(2, 2);
    const cloudMaterial_ = new THREE.ShaderMaterial({
        uniforms: {
            // ===============================
            // TIME & RESOLUTION CONTROLS
            // ===============================
            u_time: { value: 0.0 },  // Global time for animations
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, // Screen resolution for ray generation

            // ===============================
            // CAMERA PROPERTIES
            // ===============================
            u_cameraPos: { value: camera_.position },        // Camera world position
            u_cameraWorldMatrix: { value: camera_.matrixWorld }, // Camera transformation matrix
            u_cameraFrustumSize: { value: 1.0 },                  // For LOD calculations

            // ===============================
            // CLOUD VOLUME GEOMETRY
            // ===============================
            u_cloudInnerRadius: { value: soilRadius * cloudInnerRadiusMultiplier }, // Inner edge of cloud layer
            u_cloudOuterRadius: { value: soilRadius * cloudOuterRadiusMultiplier }, // Outer edge of cloud layer

            // ===============================
            // CLOUD COVERAGE CONTROLS
            // ===============================
            u_cloudCover: { value: 0.65 },                        // Overall cloud coverage (0=clear, 1=overcast)
            u_percentageCloud: { value: percentageCloud },                    // Weather map threshold (controls cloud sparsity)

            // ===============================
            // LIGHTING CONFIGURATION
            // ===============================
            u_sunColor: { value: new THREE.Color(1.0, 0.9, 0.8).multiplyScalar(1.5) }, // Warm sunlight color
            u_ambientColor: { value: new THREE.Color(0.01, 0.01, 0.01) },              // Very dark ambient (space)
            u_sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5).normalize() },     // Sun direction vector
            u_cloudBaseColor: { value: cloudColor }, // White color

            // ===============================
            // CLOUD SHAPE PARAMETERS
            // ===============================
            u_weatherScale: { value: 0.1 },      // Scale of weather patterns (lower = larger systems)
            u_weatherStrength: { value: 0.4 },   // How strongly weather affects clouds (0-1)
            u_cloudClumping: { value: 0.6 },     // Worley noise influence (higher = more separated clouds)

            // ===============================
            // SEED-BASED PATTERN SYSTEM
            // ===============================
            // Current pattern seeds
            u_noiseSeed1: { value: cloudPresets_[currentPreset_].seed1 }, // Base cloud pattern seed
            u_noiseSeed2: { value: cloudPresets_[currentPreset_].seed2 }, // Detail pattern seed
            u_noiseSeed3: { value: cloudPresets_[currentPreset_].seed3 }, // Weather pattern seed
            
            // Transition system
            u_seedTransition: { value: 0.0 },    // Interpolation factor (0=current, 1=target)
            
            // Target pattern seeds (for smooth transitions)
            u_nextSeed1: { value: cloudPresets_[currentPreset_].seed1 },
            u_nextSeed2: { value: cloudPresets_[currentPreset_].seed2 },
            u_nextSeed3: { value: cloudPresets_[currentPreset_].seed3 },

            u_cloudRotation: { value: 0.0 },        // Y-axis rotation in radians
            u_rotationMatrix: { value: new THREE.Matrix3() }, // 3x3 rotation matrix
        },
        
        vertexShader: getVertexShader_(),
        fragmentShader: getFragmentShader_(),
        
        // ===============================
        // MATERIAL PROPERTIES
        // ===============================
        transparent: true,           // Enable transparency for cloud blending
        opacity: 0.2,               // Base opacity (actual opacity calculated in shader)
        depthWrite: false,          // Don't write to depth buffer (for proper blending)
        depthTest: false,           // Don't test depth (full-screen effect)
        side: THREE.DoubleSide,     // Render both sides of quad
        blending: THREE.NormalBlending  // Standard alpha blending
        });

        const cloudQuad = new THREE.Mesh(cloudGeometry, cloudMaterial_);
        cloudQuad.renderOrder = 1; // Render clouds after planet
        return {cloudMaterial_ ,cloudQuad};
    }

export default getCloudLayer;