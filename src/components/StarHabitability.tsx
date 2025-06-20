"use client"
import { useState, useEffect, useMemo } from "react"
import SpaceScene from "./SpaceScene"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function Sim() {
  // Base values and scaling
  const radiusP = 13; // Earth radii
  const massP = 189; // Earth masses
  const massS = 0.85; // Solar masses
  const distanceFromSun = 0.03585; // AU
  const scaleDFS = (700/0.03585); // Convert Distance to AU
  const scaleR = (13/5); // Convert Earth Radius to 1 to 10 scale

  // State for sliders (using scaled values for UI)
  const [sunDistance, setSunDistance] = useState((distanceFromSun * scaleDFS));
  const [planetRadius, setPlanetRadius] = useState((radiusP / scaleR));
  const [planetMass, setPlanetMass] = useState(massP);
  const [sunMass, setSunMass] = useState(massS);

  // Convert scaled values back to astronomical units for calculations
  const actualRadius = planetRadius * scaleR; // Earth radii
  const actualDistance = sunDistance / scaleDFS; // AU
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
    const atmosphericPressure = pressureRatio; // Earth atmospheres

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

    // Calculate ESI components
    const radiusESI = 1 - Math.abs((radiusEarth - 1) / (radiusEarth + 1));
    const densityESI = 1 - Math.abs((density - 1) / (density + 1));
    const escapeESI = 1 - Math.abs((escapeVelocity - 1) / (escapeVelocity + 1));
    const tempESI = 1 - Math.abs((temperature - 1) / (temperature + 1));
    const periodESI = 1 - Math.abs((orbitalPeriod - 1) / (orbitalPeriod + 1));
    const pressureESI = 1 - Math.abs((atmosphericPressure - 1) / (atmosphericPressure + 1));

    // Weighted geometric mean
    const combinedESI = Math.pow(
      Math.pow(radiusESI, weights.radius / 4) *
      Math.pow(densityESI, weights.density / 4) *
      Math.pow(escapeESI, weights.escapeVelocity / 4) *
      Math.pow(tempESI, weights.temperature / 4) *
      Math.pow(periodESI, weights.orbitalPeriod / 4) *
      Math.pow(pressureESI, weights.pressure / 4),
      4
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
    setPlanetRadius(value[0]);
  };

  const handleSunDistance = (value: number[]) => {
    setSunDistance(value[0]);
  };

  const handleSunMass = (value: number[]) => {
    setSunMass(value[0]);
  };

  const handlePlanetMass = (value: number[]) => {
    setPlanetMass(value[0]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <SpaceScene
        soilRadius={actualRadius}
        sunDistanceX={sunDistance}
        lightIntensity={2}
        sunRadius={actualSunMass * 20}
        enableSoil={true}
        enableWater={true}
        enableCloud={true}
        enableFresnel={true}
      />
      
      {/* Controls Panel - Left Side */}
      <div className="absolute top-4 left-4 w-80 bg-black/20 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Planet Controls</h2>
        
        <div className="space-y-6">
          {/* Planet Radius */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Planet Radius</label>
              <AnimatedNumber 
                value={actualRadius} 
                decimals={2} 
                suffix=" R⊕" 
                className="text-sm text-blue-400 font-mono"
              />
            </div>
            <Slider
              value={[planetRadius]}
              onValueChange={handlePlanetRadius}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Planet Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Planet Mass</label>
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
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Sun Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Star Mass</label>
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
              min={0.1}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Distance from Sun */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Distance from Star</label>
              <AnimatedNumber 
                value={actualDistance} 
                decimals={3} 
                suffix=" AU" 
                className="text-sm text-blue-400 font-mono"
              />
            </div>
            <Slider
              value={[sunDistance]}
              onValueChange={handleSunDistance}
              max={1000}
              min={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Habitability Card - Right Side */}
      <div className="absolute top-4 right-4 w-96">
        <Card className="bg-black/20 backdrop-blur-md border border-white/10 text-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Habitability Assessment</CardTitle>
            <Badge className={`${habitabilityClass.color} text-white text-sm px-3 py-1`}>
              {habitabilityClass.class}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* ESI Score - Large and Centered */}
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                <AnimatedNumber value={esi} decimals={3} className="text-5xl font-bold text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">Earth Similarity Index</p>
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
                  <p className="text-gray-400">Density</p>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.density} decimals={2} suffix=" ρ⊕" />
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400">Escape Velocity</p>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.escapeVelocity} decimals={2} suffix=" v⊕" />
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400">Orbital Period</p>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.orbitalPeriod} decimals={2} suffix=" years" />
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400">Temperature</p>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.temperatureK} decimals={0} suffix=" K" />
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400">Atmospheric Pressure</p>
                  <p className="font-mono text-blue-400">
                    <AnimatedNumber value={derivedParams.atmosphericPressure} decimals={2} suffix=" atm" />
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400">Surface Gravity</p>
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
  );
}
