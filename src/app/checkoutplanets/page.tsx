"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
export default function CheckoutPlanets() {
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto pt-5">
        <HoverEffect items={planets} />
      </div>
      <Footer />
    </div>
  );
}
const planets = [
  {
    title: "Kepler-22b",
    description:
      "An ocean-covered super-Earth in the habitable zone, Kepler-22b was the first confirmed exoplanet in this zone, sparking interest in life-supporting worlds beyond our solar system.",
    imageUrl: "/images/Kepler22b.jpg",
    link: "/checkoutplanets/Kepler-22b",
  },
  {
    title: "Proxima Centauri B",
    description:
      "Orbiting our nearest stellar neighbor, Proxima b lies within the habitable zone and may have liquid water, though frequent stellar flares make its true habitability uncertain.",
    imageUrl: "/images/ProximaCentauriB.png",
    link: "/checkoutplanets/Proxima_Centauri-b",
  },
  {
    title: "TRAPPIST-1e",
    description:
      "One of seven Earth-sized planets in the TRAPPIST-1 system, TRAPPIST-1e is especially promising for potential habitability, with a rocky surface and possible atmosphere.",
    imageUrl: "/images/Trappist-1e.jpeg",
    link: "/checkoutplanets/Trappist-1e",
  },
  {
    title: "HD 209458 b (Osiris)",
    description:
      "A famous “hot Jupiter,” Osiris was the first exoplanet discovered transiting its star and the first with an atmosphere detected, revealing atmospheric escape in action.",
    imageUrl: "/images/osiris.png",
    link: "/checkoutplanets/HD-209458b",
  },
  {
    title: "51 Pegasi b (Dimidium)",
    description:
      "The first confirmed exoplanet orbiting a Sun-like star, 51 Pegasi b is a gas giant that challenged traditional planet formation theories due to its close-in orbit.",
    imageUrl: "/images/pegasiB.png",
    link: "/checkoutplanets/Dimidium",
  },
  {
    title: "Kepler-452b",
    description:
      "Often called “Earth's cousin,” Kepler-452b is a super-Earth in the habitable zone of a Sun-like star, possibly hosting a rocky surface and thick atmosphere.",
    imageUrl: "/images/kepler-452-b.webp",
    link: "/checkoutplanets/Kepler-452b",
  },
  {
    title: "GJ 1214b",
    description:
      "Known as a “mini-Neptune,” this exoplanet likely has a thick, steamy atmosphere and could be water-rich beneath—a laboratory for studying non-Earth-like planetary conditions.",
    imageUrl: "/images/gj1214b.jpeg",
    link: "/checkoutplanets/GJ-1214b",
  },
];
