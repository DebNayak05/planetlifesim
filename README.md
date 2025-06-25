# ExoCosmos

**A 3D Exoplanet Simulator for Habitability Exploration**

**ExoCosmos** is an interactive web-based simulation that allows users to visualize real exoplanets in 3D and experiment with planetary and stellar properties to understand habitability using the Earth Similarity Index (ESI). Inspired by NASA’s *Eyes on Exoplanets*, this project extends the concept by allowing users to actively modify planetary conditions to explore how small changes impact the potential for life.


📝 **[Read the complete technical deep-dive](https://dev.to/devesh0099/building-a-3d-exoplanet-simulator-with-real-time-habitability-analysis-29b8)**

---

## Features

- **Planet Selection**: Browse and select from a curated set of real exoplanets discovered by astronomers.
- **3D Visualization**: View rotatable, zoomable models of planets and their host stars using WebGL-based rendering.
- **Parameter Adjustment**: Modify key scientific variables using sliders:
  - Planetary Mass
  - Planetary Radius
  - Star Mass
  - Distance from Star
- **Real-Time ESI Feedback**: Changes are immediately reflected in the planet’s Earth Similarity Index score.
- **Educational Content**: Each planet includes factual data, habitability explanations, and insights based on astrophysical principles.

---

## Technology Stack

- **Frontend**: Next.js, React
- **Styling**: TailwindCSS, Shadcn/UI, Aceternity UI
- **3D Graphics**: Three.js, custom shaders, procedural rendering techniques
- **State Management**: React state with modular components
- **Scientific Modeling**: Custom Earth Similarity Index calculation derived from scientific literature

---

## Development Highlights

### 3D Rendering

- Implemented shader-based **Fresnel effects**, **ray marching**, and **volumetric clouds**
- Used procedural generation techniques such as **Fractal Brownian Motion** and **Worley Noise** for atmospheric and surface realism
- Built a **Level of Detail (LoD)** system to optimize performance across zoom levels
- Layered maps for terrain detail: displacement, normal, ambient occlusion, and diffuse

### Scientific Modeling

- Researched multiple habitability metrics: ESI, RSI, BSI, PHI, SEPHI
- Selected and adapted ESI for balance between scientific accuracy and usability
- Condensed habitability modeling into four user-friendly sliders, calculating six backend parameters in real time
- Developed an interactive scoring algorithm updated dynamically with UI state

### Web Interface

- Designed a responsive, accessible, and performant UI
- Built reusable components for slider controls, planet data panels, and dynamic 3D scenes
- Ensured synchronization between UI input and 3D rendering with efficient state management

---

## Challenges

- **Performance Optimization**: Managing real-time 3D rendering in the browser required tuning shaders, optimizing render loops, and selectively applying LoD.
- **Scientific Abstraction**: Translating multi-variable habitability indices into four accessible user controls while retaining scientific meaning.
- **State Synchronization**: Maintaining consistency between slider values, ESI calculations, and visual transformations without unnecessary re-renders.

---

## Future Work

- **Expanded Planetary Catalogue**: Integrate additional exoplanets using public NASA datasets.
- **Alternative Metrics**: Support for SEPHI, RSI, and other indices for a broader understanding of habitability.
- **Graphical Data Views**: Real-time charts showing how parameter changes affect ESI and related variables.
- **Educational Modules**: Develop a classroom mode with guided tutorials, learning objectives, and assessments.

---

## License
GPL 3.0 license

---

## Deployment
[ExoCosmos Live Link](https://exocosmos.onrender.com)

