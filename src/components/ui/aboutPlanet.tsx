"use client";
import { motion } from "framer-motion";
// import { PlanetInfo, TravelOptions } from "@/app/planets/planetInfo";
import { PlanetInfo, TravelOptions } from "@/app/checkoutplanets/(planets)/planetInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import numeral from "numeral";
import { useEffect, useState } from "react";

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


export default function AboutPlanet({
  planetInfo,
}: {
  planetInfo: PlanetInfo;
}) {
  const [selected, setSelected] = useState("Car");
  const [speed, setSpeed] = useState("");
  const [time, setTime] = useState("");
  const getFormat = (str: string) => {
    if (str[str.length - 1] == "b" || str[str.length - 1] == "m") {
      str += "illion";
    } else if (str[str.length - 1] == "k") {
      str = str.substring(0, str.length - 1);
      str += "thousand";
    }
    return str;
  };
  const updateSpeedAndTime = (travelOption: string, speed: number) => {
    let speedString = numeral(speed).format("0.[00] a");
    speedString = getFormat(speedString);
    setSelected(travelOption);
    setSpeed(speedString);
    const distance = planetInfo.distance;
    const lightYearInKm = 9.461e12;
    const distanceInKm = distance * lightYearInKm;
    const timeInHours = distanceInKm / speed;
    const timeInYears = Math.floor(timeInHours / (24 * 365.25));
    let timeString = numeral(timeInYears).format("0.[00] a");
    timeString = getFormat(timeString);
    setTime(timeString);
  };
  useEffect(() => {
    updateSpeedAndTime("Car", 96);
  }, []);
  return (
    <div>
      <Tabs
        defaultValue="quickInfo"
        className=" max-h-[80vh] p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6 scroll-smooth overflow-y-scroll no-scrollbar"
      >
        <TabsList>
          <TabsTrigger value="quickInfo">Quick Info</TabsTrigger>
          <TabsTrigger value="moreInfo">More Info</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="quickInfo">
          <motion.div
            key="quickInfo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white p-4">
              Quick Information
            </h2>
            <div className="backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4 text-white text-md font-semibold">
                {Object.entries(planetInfo.quickInfo).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 bg-gradient-to-r from-violet-700/30 to-violet-500/40 rounded-xl flex flex-col text-center items-center justify-center hover:scale-105 transition-all duration-500"
                  >
                    <p className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="moreInfo">
          <motion.div
            key="quickInfo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="space-y-4 text-gray-800 dark:text-gray-200">
              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-700/60 rounded-xl flex flex-col text-center items-center justify-center hover:scale-105 transition-all duration-500">
                <h3 className="text-xl font-bold">Description</h3>
                <p className="text-sm mt-1">{planetInfo.description}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-700/60 rounded-xl flex flex-col text-center items-center justify-center hover:scale-105 transition-all duration-500">
                <h3 className="text-xl font-bold">Fun Fact !</h3>
                <p className="text-sm mt-1">{planetInfo.story}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-700/60 rounded-xl flex flex-col text-center items-center justify-center hover:scale-100 transition-all duration-500">
                <h3 className="text-xl font-bold">
                  How long to Travel Here from Earth?
                </h3>
                <div>
                  <div className="grid grid-cols-5 gap-2">
                    {TravelOptions.map((value, index) => {
                      return (
                        <button
                          key={index}
                          className={`justify-center items-center text-center flex flex-col mt-3 p-3 rounded-lg transition duration-200 
                          ${
                            selected === value.label
                              ? "bg-white text-black"
                              : "bg-black text-white"
                          }
                          `}
                          onClick={() => {
                            updateSpeedAndTime(value.label, value.speed);
                          }}
                        >
                          <div>{value.icon()}</div>
                          <div>{value.label}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 text-center items-center justify-center p-3 m-3">
                    <div>
                      <p className="text-yellow-400 text-sm">TRAVEL SPEED</p>
                      <p className="text-5xl p-2"><AnimatedNumber value={parseFloat(speed.split(" ")[0])} decimals={2} /> </p>
                      <p className="text-sm">
                        {speed.split(" ")[1]} km per hour
                      </p>
                    </div>
                    <div>
                      <p className="text-yellow-400 text-sm">TRAVEL TIME</p>
                      <p className="text-5xl p-2"><AnimatedNumber value={parseFloat(time.split(" ")[0])} decimals={2} /> </p>
                      <p className="text-sm">{time.split(" ")[1]} years</p>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="challenges">
          <motion.div
            key="quickInfo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="space-y-4 text-gray-800 dark:text-gray-200">
              <div className="p-6 bg-gradient-to-r from-sky-900/30 to-sky-500/30 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-500 backdrop-blur-md border border-white/50">
                <h3 className="text-xl font-bold text-white mb-2">
                  Inhabitability Insight
                </h3>
                <p className="text-white/90 text-base">
                  This section tells us why this planet is inhabitable.
                </p>
              </div>
              {planetInfo.challenges.map((value, index) => {
                const [label, description] = value
                  .split(":")
                  .map((part) => part.trim());
                return (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-sky-500/30 to-sky-900/30 rounded-xl flex flex-col text-center items-center justify-center hover:scale-105 transition-all duration-500"
                  >
                    <h4 className="text-xl font-bold text-white mb-1">
                      {label}
                    </h4>
                    <p className="text-white/90 text-sm">{description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
