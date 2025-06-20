"use client"

import { useState } from "react"
import SpaceScene from "./SpaceScene"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function Sim() {
    // const [sceneKey, setSceneKey] = useState(0);
    const [sunDistance, setSunDistance] = useState(500);
    const [pendingSunDistance, setPendingSunDistance] = useState(500);
    const [planetRadius, setPlanetRadius] = useState(2);
    const [pendingPlanetRadius, setPendingPlanetRadius] = useState(2);

    const handleUpdate = () => {
        console.log("called");
        setPlanetRadius(pendingPlanetRadius);
        setSunDistance(pendingSunDistance);
        // setSceneKey(prev => prev + 1);
    }

    const handlePlanetRadiusSliderChange = (newRadius:number) => {
        setPendingPlanetRadius(newRadius);
    }

    const handlePlanetRadius = (value: number[]) => {
        console.log(value[0]);
        setPlanetRadius(value[0]);        
    }

    const handleSunDistanceSliderChange = (newDistance:number) => {
        setPendingSunDistance(newDistance);
    }

    const handleSunDistance = (value:number[]) => {
        console.log(value[0]);
        setSunDistance(value[0]);
    }

    return (
        <div className="relative w-full h-screen">
            <SpaceScene soilRadius={planetRadius} sunDistanceX={sunDistance} waterColor={0xffff00} />

            {/* UI Overlay */}
            <Tabs defaultValue="account" className="w-[400px] z-10 fixed top-6 left-6">
                <TabsList>
                    <TabsTrigger value="account">Basic</TabsTrigger>
                    <TabsTrigger value="password">Advance</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <div>
                        <p>Planet Radius</p> <Slider defaultValue={[planetRadius]} onValueChange={handlePlanetRadius} max={10} min={1} step={0.1} />
                    </div>
                    <div>
                        <p>Planet Mass</p> <Slider defaultValue={[2]} max={10} min={1} step={0.1} />
                    </div>
                    <div>
                        <p>Sun Mass</p> <Slider defaultValue={[2]} max={10} min={1} step={0.1} />
                    </div>
                    <div>
                        <p>Sun Distance</p> <Slider defaultValue={[sunDistance]} onValueChange={handleSunDistance} max={1100} min={400} step={100} />
                    </div>
                    <Button variant="outline" onClick={handleUpdate}>Button</Button>                    
                </TabsContent>

                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )

}