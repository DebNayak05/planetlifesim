"use client";

import { useState } from "react";
import { FaCar, FaTrain, FaJetFighter, FaSatellite, FaRocket } from "react-icons/fa6";

const travelOptions = [
  { label: "AUTO", speed: 60, time: 1940, icon: <FaCar /> },
  { label: "BULLET TRAIN", speed: 200, time: 582, icon: <FaTrain /> },
  { label: "JET", speed: 600, time: 194, icon: <FaJetFighter /> },
  { label: "VOYAGER", speed: 38000, time: 3.1, icon: <FaSatellite /> },
  { label: "LIGHT SPEED", speed: 670616629, time: 0.0002, icon: <FaRocket /> },
];

export default function TravelCalculator() {
  const [selected, setSelected] = useState(travelOptions[2]); // default: Jet

  return (
    <div className="p-8 bg-black text-white rounded-xl max-w-3xl mx-auto space-y-8">
      {/* Speed & Time */}
      <div className="grid grid-cols-2 text-center">
        <div>
          <p className="text-yellow-400 text-sm">TRAVEL SPEED</p>
          <p className="text-5xl font-bold">{selected.speed.toLocaleString()}</p>
          <p className="text-sm">Miles per hour</p>
        </div>
        <div>
          <p className="text-yellow-400 text-sm">TRAVEL TIME</p>
          <p className="text-5xl font-bold">{selected.time}</p>
          <p className="text-sm">Million years</p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-5 gap-2">
        {travelOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => setSelected(option)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition duration-200 
              ${selected.label === option.label
                ? "bg-white text-black shadow-lg"
                : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <span className="text-xs font-semibold">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
