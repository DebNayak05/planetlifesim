"use client"
import { useState, useEffect, useMemo } from "react"
import SpaceScene from "./SpaceScene"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { RotateCcw,AlertTriangle, Info } from "lucide-react"


// Animated Number Component
const AnimatedNumber = ({ value, decimals = 2, suffix = "", className = "" }: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const duration = 300;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return (
    <span className={className}>
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

// export default function Sim(radiusPlanet:number = 14, massPlanet:number = 146, massSun:number = 1.03, orbitalRadius:number=0.0527) {
  export default function Sim({
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
  cloudColorR,
  cloudColorG,
  cloudColorB,
  borderColor,
  facingColor,
  fresnelMultiplier,
  sunRadius,
  sunEmissionColor,
  sunShininess,
  lightColor,
  lightIntensity,
  enableSoil,
  enableWater,
  enableCloud ,
  enableFresnel ,

  radiusPlanet=14,
  massPlanet=146,
  massSun=1.03,
  orbitalRadius=0.0527,
}:{
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
  lightColor?:number,
  lightIntensity?:number,
  enableSoil?:boolean,
  enableWater?:boolean,
  enableCloud?:boolean,
  enableFresnel?:boolean,


  radiusPlanet?:number,
  massPlanet?:number,
  massSun?:number,
  orbitalRadius?:number,
  }={}){
    // Base values and scaling
    const radiusP = radiusPlanet; // Earth radii
    const massP = massPlanet; // Earth masses
    const massS = massSun; // Solar masses
    const distanceFromSun = orbitalRadius; // AU
    const scaleDFS = (700/distanceFromSun); // Convert Distance to AU
    const scaleR = (radiusP/2); // Convert Earth Radius to 1 to 10 scale

    // FIXED: State for sliders (UI display values 1-10 and 400-1100)
    const [planetRadiusSlider, setPlanetRadiusSlider] = useState(2); // 1-10 for UI
    const [sunDistanceSlider, setSunDistanceSlider] = useState(700); // 400-1100 for UI
    const [planetMass, setPlanetMass] = useState(massP);
    const [sunMass, setSunMass] = useState(massS);
    const [spinning, setSpinning] = useState(false);

    // FIXED: Convert slider values to astronomical units for calculations
    const actualRadius = planetRadiusSlider * scaleR; // Earth radii (max 13 when slider = 5)
    const actualDistance = sunDistanceSlider / scaleDFS; // AU (0.03585 when slider = 700)
    const actualPlanetMass = planetMass; // Earth masses
    const actualSunMass = sunMass; // Solar masses

    // Physical constants
    const EARTH_RADIUS = 6.371e6; // meters
    const EARTH_MASS = 5.972e24; // kg
    const SOLAR_MASS = 1.989e30; // kg
    const AU = 1.496e11; // meters
    const G = 6.674e-11; // m³/kg/s²
    const STEFAN_BOLTZMANN = 5.67e-8; // W/m²/K⁴
    const SOLAR_LUMINOSITY = 3.828e26; // watts

    // Calculate derived parameters
    const derivedParams = useMemo(() => {
        // Convert to SI units
        const radiusMeters = actualRadius * EARTH_RADIUS;
        const massKg = actualPlanetMass * EARTH_MASS;
        const sunMassKg = actualSunMass * SOLAR_MASS;
        const distanceMeters = actualDistance * AU;

        // 1. Density (keeping it constant means mass ∝ radius³)
        const volume = (4/3) * Math.PI * Math.pow(radiusMeters, 3);
        const density = massKg / volume; // kg/m³
        const densityEarth = density / 5515; // Earth densities (Earth = 5515 kg/m³)

        // 2. Escape velocity
        const escapeVelocity = Math.sqrt(2 * G * massKg / radiusMeters); // m/s
        const escapeVelocityEarth = escapeVelocity / 11200; // Earth escape velocities

        // 3. Orbital period (Kepler's 3rd law)
        const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(distanceMeters, 3) / (G * sunMassKg)); // seconds
        const orbitalPeriodYears = orbitalPeriod / (365.25 * 24 * 3600); // years

        // 4. Surface temperature (radiative equilibrium)
        const luminosity = actualSunMass * SOLAR_LUMINOSITY; // Assuming L ∝ M
        const albedo = 0.3; // Earth-like albedo
        const temperature = Math.pow(
        (luminosity * (1 - albedo)) / (16 * Math.PI * Math.pow(distanceMeters, 2) * STEFAN_BOLTZMANN),
        0.25
        ); // Kelvin
        const temperatureEarth = temperature / 288; // Earth temperatures (288K = 15°C)

        // 5. Atmospheric pressure (simplified relationship with temperature)
        // Using exponential relationship with temperature difference from Earth
        const tempDiff = temperature - 288; // K
        const pressureRatio = Math.exp(-tempDiff / 50); // Simplified model
        
        // 6. Surface gravity
        const surfaceGravity = G * massKg / Math.pow(radiusMeters, 2);
        const surfaceGravityEarth = surfaceGravity / 9.81;

        return {
        density: densityEarth,
        escapeVelocity: escapeVelocityEarth,
        orbitalPeriod: orbitalPeriodYears,
        temperature: temperatureEarth,
        atmosphericPressure: pressureRatio,
        temperatureK: temperature,
        radiusEarth: actualRadius,
        massEarth: actualPlanetMass
        };
    }, [actualRadius, actualPlanetMass, actualSunMass, actualDistance]);

  // Enhanced ESI calculation (6 parameters)
  const esi = useMemo(() => {
    const { density, escapeVelocity, orbitalPeriod, temperature, atmosphericPressure, radiusEarth } = derivedParams;
    
    // Weight exponents for each parameter
    const weights = {
      radius: 0.57,
      density: 1.07,
      escapeVelocity: 0.70,
      temperature: 5.58, // Most sensitive
      orbitalPeriod: 0.70,
      pressure: 0.25
    };

    // Calculate ESI components with safety checks
    const radiusESI = Math.max(0, 1 - Math.abs((radiusEarth - 1) / (radiusEarth + 1)));
    const densityESI = Math.max(0, 1 - Math.abs((density - 1) / (density + 1)));
    const escapeESI = Math.max(0, 1 - Math.abs((escapeVelocity - 1) / (escapeVelocity + 1)));
    const tempESI = Math.max(0, 1 - Math.abs((temperature - 1) / (temperature + 1)));
    const periodESI = Math.max(0, 1 - Math.abs((orbitalPeriod - 1) / (orbitalPeriod + 1)));
    const pressureESI = Math.max(0, 1 - Math.abs((atmosphericPressure - 1) / (atmosphericPressure + 1)));

    // Weighted geometric mean
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const normalizedWeights = Object.fromEntries(
      Object.entries(weights).map(([key, value]) => [key, value / totalWeight])
    );

    const combinedESI = Math.pow(
      Math.pow(radiusESI, normalizedWeights.radius) *
      Math.pow(densityESI, normalizedWeights.density) *
      Math.pow(escapeESI, normalizedWeights.escapeVelocity) *
      Math.pow(tempESI, normalizedWeights.temperature) *
      Math.pow(periodESI, normalizedWeights.orbitalPeriod) *
      Math.pow(pressureESI, normalizedWeights.pressure),
      1
    );

    return Math.max(0, Math.min(1, combinedESI));
  }, [derivedParams]);

  // Habitability classification
  const getHabitabilityClass = (esi: number) => {
    if (esi >= 0.8) return { class: "Highly Habitable", color: "bg-green-500", textColor: "text-green-700" };
    if (esi >= 0.6) return { class: "Moderately Habitable", color: "bg-yellow-500", textColor: "text-yellow-700" };
    if (esi >= 0.4) return { class: "Marginally Habitable", color: "bg-orange-500", textColor: "text-orange-700" };
    return { class: "Uninhabitable", color: "bg-red-500", textColor: "text-red-700" };
  };

  const habitabilityClass = getHabitabilityClass(esi);

  const handlePlanetRadius = (value: number[]) => {
    setPlanetRadiusSlider(value[0]);
  };

  const handleSunDistance = (value: number[]) => {
    setSunDistanceSlider(value[0]);
  };

  const handleSunMass = (value: number[]) => {
    setSunMass(value[0]);
  };

  const handlePlanetMass = (value: number[]) => {
    setPlanetMass(value[0]);
  };

  const defaultMassPlanet = radiusPlanet;
  const defaultMassSun = massSun;


  const handleClick = () => {
  if (spinning) {
    return; // Prevent multiple rapid clicks from messing up the animation
  }
  setPlanetMass(defaultMassPlanet);
  setSunMass(defaultMassSun);
  setPlanetRadiusSlider(2)
  setSunDistanceSlider(700);
  setSpinning(true);
 setTimeout(() => setSpinning(false), 1000);
};

  return (
    <TooltipProvider>
        <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <SpaceScene
        soilRadius={planetRadiusSlider}
        sunDistanceX={sunDistanceSlider}
        soilIndex={soilIndex}
        soilDisplacementScale={soilDisplacementScale}
        soilShininess={soilShininess}
        waterIndex={waterIndex}
        waterColor={waterColor}
        waterMultiplier={waterMultiplier}
        waterOpacity={waterOpacity}
        waterShininess={waterShininess}
        waterReflectivity={waterReflectivity}
        cloudInnerRadiusMultiplier={cloudInnerRadiusMultiplier}
        cloudOuterRadiusMultiplier={cloudOuterRadiusMultiplier}
        percentageCloud={percentageCloud}
        currentPreset_={currentPreset_}
        cloudColorR={cloudColorR}
        cloudColorG={cloudColorG}
        cloudColorB={cloudColorB}
        borderColor={borderColor}
        facingColor={facingColor}
        fresnelMultiplier={fresnelMultiplier}
        sunRadius={sunRadius}
        sunEmissionColor={sunEmissionColor}
        sunShininess={sunShininess}
        lightColor={lightColor}
        lightIntensity={lightIntensity}
        enableSoil={enableSoil}
        enableWater={enableWater}
        enableCloud = {enableCloud}
        enableFresnel = {enableFresnel}
      />
      
      {/* Controls Panel - Left Side */}
      <div className="absolute top-4 left-4 w-80 bg-black/20 backdrop-blur-md rounded-xl border border-white/10 p-6 ring-1 ring-white/50 shadow-[0_0_10px_rgba(255,255,255,0.6)]">
        <h2 className="text-xl font-bold text-white mb-6">Planet Controls</h2>
        
        <div className="space-y-6">
          {/* Planet Radius */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300">Planet Radius</label>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                            <p>R⊕ = Earth Radii. Affects gravity, density, and atmospheric retention.</p>
                        </TooltipContent>
                    </TooltipTrigger>
                </Tooltip>

                {/* Warning icon for extreme values */}
                {(planetRadiusSlider <= 1 || planetRadiusSlider >= 10) && (
                <Tooltip>
                    <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                    <p>Cannot render the 3D model accurately at extreme values</p>
                    </TooltipContent>
                </Tooltip>
                )}
                </div>
                
              <AnimatedNumber 
                value={actualRadius} 
                decimals={2} 
                suffix=" R⊕" 
                className="text-sm text-blue-400 font-mono"
              />
            </div>
            <Slider
              value={[planetRadiusSlider]}
              onValueChange={handlePlanetRadius}
              max={10}
              min={0.01}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Planet Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Planet Mass</label>
                    <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                            <p>M⊕ = Earth Masses. Determines escape velocity and atmospheric retention.</p>
                        </TooltipContent>
                    </TooltipTrigger>
                </Tooltip>
                </div>
              <AnimatedNumber 
                value={actualPlanetMass} 
                decimals={1} 
                suffix=" M⊕" 
                className="text-sm text-blue-400 font-mono"
              />
            </div>
            <Slider
              value={[planetMass]}
              onValueChange={handlePlanetMass}
              max={500}
              min={0.01}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Sun Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Star Mass</label>
                    <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                            <p>M☉ = Solar Masses. Affects luminosity and orbital dynamics.</p>
                        </TooltipContent>
                    </TooltipTrigger>
                </Tooltip>
                </div>
              <AnimatedNumber 
                value={actualSunMass} 
                decimals={2} 
                suffix=" M☉" 
                className="text-sm text-blue-400 font-mono"
              />
            </div>
            <Slider
              value={[sunMass]}
              onValueChange={handleSunMass}
              max={2}
              min={0.01}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Distance from Sun */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Distance from Star</label>
                    <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                            <p>Orbital distance from star. Determines temperature and habitability zone.</p>
                        </TooltipContent>
                    </TooltipTrigger>
                </Tooltip>

                {/* Warning icon for extreme values */}
                {(sunDistanceSlider <= 400 || sunDistanceSlider >= 1100) && (
                <Tooltip>
                    <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                    <p>Cannot render the 3D model accurately at extreme values</p>
                    </TooltipContent>
                </Tooltip>
                )}

                </div>
              <AnimatedNumber 
                value={actualDistance} 
                decimals={3} 
                suffix=" AU" 
                className="text-sm text-blue-400 font-mono"
              />
            </div>
            <Slider
              value={[sunDistanceSlider]}
              onValueChange={handleSunDistance}
              max={10000}
              min={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="cursor-pointer fixed top-[41.5%] left-[1.12%] z-50 rounded-2xl hover:scale-105 transition-transform duration-200 justify-center text-center items-center backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_0_10px_rgba(255,255,255,0.6)]">
      <Button className="bg-black/20 backdrop-blur-md border border-white/10 text-white hover:text-black hover:bg-white/80 transition-colors duration-200" onClick={handleClick}>
        <RotateCcw size={16} className={`mr-2 ${spinning ? 'spin-animation' : ''}`}/>
        Reset
      </Button>
      </div>

      {/* Habitability Card - Right Side */}
      <div className="absolute top-4 right-4 w-96">
        <Card className="bg-black/20 backdrop-blur-md border border-white/10 text-white ring-1 ring-white/50 shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Habitability Assessment</CardTitle>
            <div className="flex justify-center">
              <Badge className={`${habitabilityClass.color} text-white text-sm px-3 py-1`}>
                {habitabilityClass.class}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* ESI Score - Large and Centered */}
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                <AnimatedNumber value={esi} decimals={3} className="text-5xl font-bold text-blue-400" />
              </div>
              <div className="flex items-center gap-2  justify-center">
                <p className="text-sm text-gray-400">Earth Similarity Index</p>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                    <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                      Scale from 0-1 comparing planet to Earth. Values 0.8-1.0 indicate Earth-like conditions. Based on radius, density, escape velocity, and temperature - with temperature having the strongest influence.
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    esi >= 0.8 ? 'bg-green-500' : 
                    esi >= 0.6 ? 'bg-yellow-500' : 
                    esi >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${esi * 100}%` }}
                />
              </div>
            </div>

            {/* Derived Parameters */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">Density</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                          Mass per unit volume (g/cm³). Increases with mass, decreases with radius cubed. Earth's density: 5.5 g/cm³. Higher density = rockier composition, better atmospheric retention.
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>
                  
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.density} decimals={2} suffix=" ρ⊕" />
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">Escape Velocity</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                          Minimum speed to escape planet's gravity (km/s). Formula: √(2GM/R). Increases with mass, decreases with radius. Earth's: 11.2 km/s. Higher values retain atmospheres better.
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>
                  
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.escapeVelocity} decimals={2} suffix=" v⊕" />
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">Orbital Period</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                          Time to complete one orbit around the star. Increases with orbital distance cubed (Kepler's 3rd Law). Affects seasonal patterns and climate stability.
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>
                  
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.orbitalPeriod} decimals={2} suffix=" years" />
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">Temperature</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                          Average surface temperature. Decreases with orbital distance squared. Affected by stellar mass (luminosity) and atmospheric greenhouse effects. Critical for liquid water
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.temperatureK} decimals={0} suffix=" K" />
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">Atmospheric Pressure</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                          Weight of atmosphere pressing down. Depends on planet mass (gravity), atmospheric composition, and temperature. Earth: 1 bar. Affects liquid water stability
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.atmosphericPressure} decimals={2} suffix=" atm" />
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">Surface Gravity</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                        <TooltipContent className="max-w-xs w-60 whitespace-normal break-words">
                          Gravitational pull at surface. Scales as Mass/Radius². Doubling mass doubles gravity; doubling radius quarters it. Affects atmospheric retention and escape velocity
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber 
                      value={actualPlanetMass / (actualRadius * actualRadius)} 
                      decimals={2} 
                      suffix=" g⊕" 
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Habitability Factors */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300">Key Factors</h3>
              <div className="space-y-2 text-xs">
                {derivedParams.temperatureK >= 273 && derivedParams.temperatureK <= 373 && (
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Liquid water possible
                  </div>
                )}
                {derivedParams.atmosphericPressure >= 0.1 && derivedParams.atmosphericPressure <= 10 && (
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Suitable atmospheric pressure
                  </div>
                )}
                {actualPlanetMass >= 0.1 && actualPlanetMass <= 10 && (
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Can retain atmosphere
                  </div>
                )}
                {actualRadius >= 0.5 && actualRadius <= 2.5 && (
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Rocky planet size
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
