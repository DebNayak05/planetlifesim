import { ReactNode } from "react";
import { FaCar, FaJetFighter, FaRocket, FaSatellite, FaTrain } from "react-icons/fa6";

export interface PlanetInfo {
  quickInfo: {
    yearOfDiscovery: string;
    planetType: string;
    orbitalRadius: string;
    orbitalPeriod: string;
    orbitalEccentricity: string;
    planetMass: string;
    planetRadius: string;
    hostStarMass: string;
    hostStarRadius: string;
    observatory: string;
  };
  distance : number;
  description: string;
  story: string;
  challenges: String[];
}
export interface TravelOption {
  label : string,
  speed : number,
  icon : () => ReactNode
}

export const TravelOptions : TravelOption[] = [
  {
    label : "Car",
    speed : 96,
    icon : () => FaCar({}),
  },
  {
    label : "Bullet Train",
    speed : 193,
    icon : () => FaTrain({}),
  },
  {
    label : "Jet",
    speed : 965,
    icon : () => FaJetFighter({}),
  },
  {
    label : "Voyager",
    speed : 61155,
    icon : () => FaSatellite({}),
  },
  {
    label : "Light Speed",
    speed : 1079252848,
    icon : () => FaRocket({}),
  },
]
export const dummyPlanetInfo: PlanetInfo = {
  quickInfo: {
    yearOfDiscovery: "dummy",
    planetType: "dummy",
    orbitalRadius: "dummy",
    orbitalPeriod: "dummy",
    orbitalEccentricity: "dummy",
    planetMass: "dummy",
    planetRadius: "dummy",
    hostStarMass: "dummy",
    hostStarRadius: "dummy",
    observatory: "dummy",
  },
  distance : 69,
  description: "dummy",
  story: "dummy",
  challenges: ["dummy", "dummy"],
};
const planetMap = new Map<string, PlanetInfo>();
planetMap.set("Dimidium", {
  quickInfo: {
    yearOfDiscovery: "1995 (Oct 6)",
    planetType: "Gas giant (hot Jupiter)",
    orbitalRadius: "0.0527 AU",
    orbitalPeriod: "4.2308 days (~101.54 h)",
    orbitalEccentricity: "~0.013",
    planetMass: "~0.46 MJ (~147 M⊕)",
    planetRadius: "~1.9 RJ (~17.9 R⊕)",
    hostStarMass: "~1.04 M ☉",
    hostStarRadius: "~1.27 R☉",
    observatory: "Haute-Provence Observatory (ELODIE)",
  },
  distance : 50,
  description:
    "A classic hot Jupiter, Dimidium is ~0.46 MJ and ~1.9 RJ, orbiting its Sun-like star in just 4.23 days at 0.053 AU. It's inflated and extremely hot (~1,260 K), likely tidally locked.",
  story:
    "Michel Mayor and Didier Queloz used the ELODIE spectrograph at Haute-Provence Observatory in France to detect stellar wobble caused by the planet's 4.23-day orbit. Announced on October 6, 1995, this groundbreaking detection was the first confirmed hot Jupiter and earned them the 2019 Nobel Prize.",
  challenges: [
    "Type and Composition: Dimidium is a gas giant without a solid surface, featuring a thick gaseous atmosphere possibly containing silicate clouds - making it fundamentally inhospitable to life.",
    "Extreme Proximity to Its Star: Dimidium orbits extremely close to its star at 0.0527 AU, resulting in scorching surface temperatures of 992°C - far too hot for liquid water or life.",
    "Tidal Locking: Tidally locked with one side in perpetual daylight and the other in darkness, the planet experiences extreme temperature differences that make it unsuitable for life.",
    "Hot Jupiter Characteristics: As a 'hot Jupiter,' Dimidium's atmosphere is superheated and puffed up by intense stellar radiation, creating hostile conditions incompatible with life.",
  ],
});

planetMap.set("Kepler-452b", {
  quickInfo: {
    yearOfDiscovery: "2015",
    planetType: "Super-Earth",
    orbitalRadius: "1.046 AU",
    orbitalPeriod: "384.8 days",
    orbitalEccentricity: "~0.0 (assumed circular)",
    planetMass: "~3.3 M⊕ (model-dependent)",
    planetRadius: "~1.63 R⊕",
    hostStarMass: "~1.04 M☉ (1.11 ± 0.15)",
    hostStarRadius: "~1.11 R☉",
    observatory: "NASA Kepler Space Telescope",
  },
  distance : 1799,
  description:
    "A super-Earth ~1.6 R⊕, ~3.3 M⊕, orbiting a Sun-like G2 star at 1.05 AU in ~385 days. Receives ~10% more stellar flux than Earth; best Sun-Earth analog candidate.",
  story:
    "Detected via transits in four years of Kepler data, Kepler-452b was statistically validated in 2015 using the BLENDER analysis pipeline. Its long period of 384.84 days and Earth-like size and orbit garnered attention as one of the most Earth-analog candidates in the Kepler dataset.",
  challenges: [
    "Runaway Greenhouse Effect Risk: Kepler-452b absorbs 10 % more sunlight, and even modest CO₂ could trigger a Venus-like runaway greenhouse, likely sterilising the planet and rendering its surface uninhabitable.",
    "Uncertain Atmospheric Composition: Kepler-452b's unknown atmosphere requires precise conditions - CO₂ below 0.04 bar and total pressure under 2 bar - or excessive greenhouse gases would render the surface too hot for life.",
    "Possible Non-Rocky Composition: Kepler-452b's large size (1.63 times Earth's radius) suggests it could be Neptune-like with an icy mantle and gaseous envelope rather than rocky, potentially lacking any solid surface for life.",
    "Advanced Stellar Age and Evolving Habitability: Kepler-452b's star is 6 billion years old - 1.5 billion years older than the Sun - and as aging stars brighten, the planet may already be losing its surface water to a runaway greenhouse effect",
    "Other Climate and Orbital Factors: Habitability depends on orbital eccentricity, rotation period, and axial tilt - with high eccentricity (>0.3) reducing habitability, and only narrow parameter combinations providing sufficient time for detectable biosignatures to develop.",
  ],
});

planetMap.set("Kepler-22b", {
  quickInfo: {
    yearOfDiscovery: "2011",
    planetType: "Super-Earth (possible ocean-world)",
    orbitalRadius: "0.812 AU",
    orbitalPeriod: "289.9 days",
    orbitalEccentricity: "< 0.72",
    planetMass: "~9.1 M⊕ (upper limit ~52 M⊕)",
    planetRadius: "~2.1 R⊕",
    hostStarMass: "~0.97 M☉",
    hostStarRadius: "~0.98 R☉",
    observatory: "NASA Kepler Space Telescope",
  },
  distance : 635,
  description:
    "A super-Earth (~2.1 R⊕) in Kepler-22's habitable zone, potentially an ocean world. It has moderate temperature (~279 K), orbiting every 290 days at 0.81 AU, eccentricity low.",
  story:
    "Kepler-22b was first flagged via transits detected by Kepler in May 2009. Confirmation occurred in December 2011 through follow-up observations including Spitzer, ground spectroscopy, imaging, and Keck RV, validating its status as the first habitable-zone transiting super-Earth.",
  challenges: [
    "Uncertain and Likely Hostile Atmospheric Composition: Kepler-22b's large size (2.4 times Earth's radius) suggests a thick atmosphere - possibly hydrogen-helium dominated like Neptune - that could create extreme greenhouse heating, potentially vaporizing water and rendering the planet uninhabitable.",
    "Planet Size and Surface Gravity: Kepler-22b is much larger than Earth with 9.1 times the mass and 2.1-2.4 times the radius, creating surface gravity over twice Earth's - making conditions physically challenging for Earth-like life.",
    "Lack of Evidence for Essential Life-Supporting Elements: Kepler-22b lacks confirmed oxygen or life-supporting gases, and while it may have a global ocean, the water could be acidic or toxic - making it potentially uninhabitable despite being in the habitable zone.",
    "Uncertainty in Surface and Environmental Conditions: Kepler-22b may lack a solid surface entirely, being gaseous or ocean-covered with no land, while temperature estimates assume an Earth-like atmosphere that's unlikely given its size - and a highly elliptical orbit could create extreme temperature swings.",
    "Habitability Zone Limitations: While Kepler-22b orbits within its star's habitable zone, recent models suggest it is only marginally within the empirical habitable zone (based on Venus and early Mars) and has less than a 5% chance of being in the more conservative, truly life-friendly zone",
  ],
});

planetMap.set("Trappist-1e", {
  quickInfo: {
    yearOfDiscovery: "2017",
    planetType: "Terrestrial (rocky)",
    orbitalRadius: "0.02925 AU",
    orbitalPeriod: "6.10 days",
    orbitalEccentricity: "~0.01",
    planetMass: "~0.692 M⊕",
    planetRadius: "~0.92 R⊕",
    hostStarMass: "0.0898 M☉",
    hostStarRadius: "0.1192 R☉",
    observatory: "TRAPPIST (La Silla), Spitzer, others",
  },
  distance : 41,
  description:
    "A rocky Earth-sized planet in the habitable zone of ultracool dwarf TRAPPIST-1. Dense (~5.65 g/cc), 0.92 R⊕ and 0.69 M⊕, a top candidate for habitable conditions amid low stellar irradiation.",
  story:
    "Discovered via transits with Belgian TRAPPIST telescope and confirmed with Spitzer and ground observatories. Transit-timing analysis in 2017 enabled mass/radius constraints. Follow-up refined parameters, identifying e as the densest, most Earth-like of the TRAPPIST-1 planets.",
  challenges: [
    "Atmospheric Loss Due to Stellar Activity: TRAPPIST-1e orbits extremely close to its red dwarf star, experiencing intense UV radiation and energetic particles that strip its atmosphere - with recent studies confirming electric currents are actively destroying its protective atmosphere.",
    "Lack of a Stable Atmosphere: Without an atmosphere, TRAPPIST-1e cannot sustain liquid water despite being in the habitable zone, as there's no surface pressure to prevent boiling and no radiation protection. Current evidence suggests the planet likely lacks any substantial atmosphere capable of supporting life.",
    "Harsh Early Conditions: TRAPPIST-1, like many red dwarfs, was much hotter in its youth. Early in the system's history, TRAPPIST-1e would have been subjected to intense heat, likely causing any surface water to evaporate and escape into space. This early loss of water would make it difficult for the planet to ever develop or retain oceans, lakes, or rivers - key ingredients for life.",
    "High Radiation Environment: Even if an atmosphere once existed, the planet is bombarded by UV and other high-energy radiation from its star. This not only strips atmospheres but also poses a direct threat to any potential life forms, especially complex life",
    "Possible Tidal Locking: TRAPPIST-1e is likely tidally locked, meaning one side always faces the star while the other is in perpetual darkness. This could create extreme temperature differences and make it difficult for a stable, life-supporting climate to exist, though some models suggest a sufficiently thick atmosphere could redistribute heat if one existed.",
  ],
});

planetMap.set("GJ-1214b", {
  quickInfo: {
    yearOfDiscovery: "2009 (Dec 16)",
    planetType: "Mini-Neptune",
    orbitalRadius: "0.01505 AU",
    orbitalPeriod: "1.580 days (~37.9 h) ",
    orbitalEccentricity: "~0.01 (assumed circular)",
    planetMass: " ~8.41 M⊕",
    planetRadius: "~2.68 R⊕",
    hostStarMass: "~0.15 M☉ (M-dwarf)",
    hostStarRadius: "~0.21 R☉",
    observatory: "MEarth Project + ESO La Silla (HARPS)",
  },
  distance : 48,
  description:
    "A nearby mini-Neptune (~8.4 M⊕, ~2.7 R⊕) orbiting a cool M-dwarf in 1.6 days at 0.015 AU. Likely enveloped by a thick hydrogen/volatile layer; prime target for atmospheric studies.",
  story:
    "Detected by the MEarth Project's transit survey in early 2009, GJ 1214 b was confirmed on December 16, 2009, via HARPS radial velocities at La Silla Observatory. It offered one of the first opportunities to study a mini-Neptune's atmosphere thanks to its transiting geometry and proximity (~48 ly).",
  challenges: [
    "Extremely High Temperatures: GJ 1214b orbits extremely close to its star at just 0.015 AU, completing an orbit in 1.6 days, resulting in scorching surface temperatures of 280-536°C - far too hot for liquid water or life.",
    "Thick, Inhospitable Atmosphere: GJ 1214b has a thick atmosphere of water vapor, CO₂, and methane creating crushing surface pressures, while dense haze blocks sunlight - preventing liquid water and making photosynthesis impossible.",
    "Lack of Evidence for Essential Life-Supporting Elements: Kepler-22b lacks confirmed oxygen or life-supporting gases, and while it may have a global ocean, the water could be acidic or toxic - making it potentially uninhabitable despite being in the habitable zone.",
    "Absence of Liquid Water on the Surface: GJ 1214b's extreme heat and pressure prevent liquid water on its surface, instead creating exotic forms like 'hot ice,' superfluid water, or plasma water - all incompatible with life as we know it",
    "Extreme Surface Pressure: The thick atmosphere exerts immense pressure on the surface, further reducing the possibility of any life form surviving. High pressures, combined with high temperatures, break down complex chemistry necessary for life and prevent the formation of stable chemical bonds.",
  ],
});

planetMap.set("HD-209458b", {
  quickInfo: {
    yearOfDiscovery: "1999",
    planetType: "Hot Jupiter (gas giant)",
    orbitalRadius: "0.04707 AU",
    orbitalPeriod: "3.525 days (~84.6 h)",
    orbitalEccentricity: "< 0.0081",
    planetMass: "~220 M⊕",
    planetRadius: "~15.5 R⊕",
    hostStarMass: "~1.1 M☉",
    hostStarRadius: "~1.1 R☉",
    observatory: "High Altitude Observatory & Geneva Observatory",
  },
  distance : 158,
  description:
    "A bloated hot Jupiter with ~0.69 MJ and ~1.38 RJ, orbiting at 0.047 AU every 3.5 days. Its atmosphere is intensely heated (~1500 K) and displays transit absorption features.",
  story:
    "Detected via radial velocities by Mayor et al. in 1999, atmospheric transit signatures were observed shortly after by Charbonneau et al. at High Altitude and Geneva Observatories, followed by photometry confirming transits. It became the first exoplanet with observed atmosphere, significantly advancing exoplanetary science.",
  challenges: [
    "Extreme Temperature: The planet experiences scorching temperatures of approximately 1,100 degrees Celsius (2,000 degrees Fahrenheit) due to its proximity to its host star. At these temperatures, metals would melt instantly, making the surface completely hostile to life.",
    "Toxic Atmospheric Composition: The atmosphere contains numerous toxic compounds including vanadium and titanium oxides in its upper cloud layers. These heavy metal compounds create a poisonous environment that would be lethal to any biological processes.",
    "Extreme Proximity to Host Star: The planet orbits just 0.04707 AU from its star, completing an orbit every 3.5 days. This extreme closeness subjects the planet to intense stellar radiation that would sterilize any potential biological material.",
    "Lack of Solid Surface: HD 209458b is a gas giant with no solid surface for life to develop on. The planet is primarily gaseous, resembling Jupiter and Saturn, providing no stable foundation for terrestrial-based life forms.",
    "Lack of Water in Liquid Form: While water vapor has been detected in the atmosphere, the extreme temperatures prevent liquid water from existing, eliminating this essential requirement for life as we know it.",
  ],
});

planetMap.set("Proxima_Centauri-b", {
  quickInfo: {
    yearOfDiscovery: "2016",
    planetType: "Super-Earth / terrestrial",
    orbitalRadius: " ~0.04856 AU",
    orbitalPeriod: "~11.2 days",
    orbitalEccentricity: "~0.02",
    planetMass: "≥ 1.07 M⊕",
    planetRadius: "~1.03 R⊕",
    hostStarMass: "0.12 M☉",
    hostStarRadius: "0.119 R☉",
    observatory: "European Southern Observatory (HARPS spectrograph)",
  },
  distance : 4,
  description:
    "A terrestrial super-Earth orbiting the nearest star, Proxima Centauri. At ~0.05 AU with 11 day period, modest eccentricity, it lies in the habitable zone though strong stellar flares may challenge its atmosphere.",
  story:
    "Anglada-Escudé et al. reported Proxima b in August 2016 using years of ESO HARPS and UVES radial velocity data, detecting ~1.24 m/s stellar wobble. The discovery marked the nearest potentially habitable exoplanet ever found.",
  challenges: [
    "Extreme Stellar Radiation and Flares: Proxima Centauri b orbits a highly active red dwarf that emits intense flares, increasing brightness over 1,000 times. This high-energy radiation strips atmospheres and sterilizes surfaces.",
    "Atmospheric Loss: Intense radiation and stellar winds from Proxima Centauri erode Proxima b's atmosphere. Without atmospheric protection, the surface faces harmful radiation and water loss to space.",
    "Ozone Layer Destruction: Stellar flares destroy ozone layers on Earth-like atmospheres. Without ozone protection, lethal UV radiation bombards the surface, killing even the most resilient microorganisms completely.",
    "Water Loss: X-ray and UV radiation break apart atmospheric water molecules, allowing hydrogen to escape into space. This process gradually removes all surface and atmospheric water.",
    "Weak or Absent Magnetic Field: Without a strong magnetic field, Proxima b cannot shield itself from stellar wind and radiation, severely accelerating atmospheric loss beyond Earth's rates.",
    "Tidal Locking: Proxima b's proximity causes tidal locking, creating extreme temperature differences between day and night sides, though ocean currents might redistribute heat for partial habitability."
  ],
});

export default planetMap;
