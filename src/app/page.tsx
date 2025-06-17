"use client";
import { Highlight } from "@/components/ui/hero-highlight";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/backgroundbeams";
import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="bg-[url(/images/bg-image.png)] bg-[center_-550px] scroll-smooth overflow-y-scroll no-scrollbar">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <Navbar />
      <main className="flex-grow">
        <div className="w-full flex justify-center items-center h-screen ">
          <div className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto translate-y-[-50%]">
            <p>
              <Highlight className="text-black dark:text-white">
                Worlds of Tomorrow
              </Highlight>
            </p>
            <p>
              Discover Their Potential for Life.
            </p>

            <Button className="w-48 justify-center text-base font-semibold tracking-wide m-2">
              <a href="#about">About us</a>
            </Button>
            <Button className="w-48 justify-center text-base font-semibold tracking-wide m-2">
              <Link href="/checkoutplanets">Checkout Planets</Link>
            </Button>
          </div>
        </div>
        <div
          id="about"
          className="w-full flex justify-center items-center h-screen "
        >
          <div className="w-full min-h-screen bg-cover bg-center flex items-center justify-center">
            <div className="bg-white/0 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-lg text-white min-w-3/4 max-w-3/4 justify-center text-center">
              <p className="text-2xl p-4">Discover. Customize. Imagine.</p>
              <p className="p-4">
                Ever wondered what it's like to stand on a distant world? Our
                platform brings the universe closer to you by letting you
                explore real exoplanets in stunning 3D. Dive deep into their
                unique terrains, spin them around, and learn fascinating facts
                about their atmosphere, temperature, gravity, and more.
              </p>
              <Button className="justify-center text-base font-semibold tracking-wide m-2 backdrop-blur-md bg-white/10 border border-white/30 text-white hover:bg-white/20 transition duration-300 ease-in-out rounded-xl shadow-md p-4">
                <a href="/#about2">But we don't stop here.</a>
              </Button>
            </div>
          </div>
        </div>
        <div
          id="about2"
          className="w-full flex justify-center items-center h-screen "
        >
          <div className="w-full min-h-screen bg-cover bg-center flex items-center justify-center">
            <div className="bg-white/0 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-lg text-white min-w-3/4 max-w-3/4 justify-center text-center">
              <p className="p-4">
                What if you could change a planet's environment? What if
                tweaking its atmosphere, water levels, or sunlight could turn a
                barren rock into a new Earth?
              </p>
              <p className="text-2xl p-4">Key Features</p>
              <div className="backdrop-blur-md bg-sky-300/10 border border-white/20 rounded-2xl p-6 w-fit mx-auto m-4">
                <div className="grid grid-cols-2 gap-4 text-white text-md font-semibold">
                  <div className="p-4 bg-sky-500/20 rounded-xl text-center hover:scale-105 transition-all duration-500">
                    Visualize planets with realistic 3D models
                  </div>
                  <div className="p-4 bg-sky-500/20 rounded-xl text-center hover:scale-105 transition-all duration-500">
                    Experiment with planetary parameters
                  </div>
                  <div className="p-4 bg-sky-500/20 rounded-xl text-center hover:scale-105 transition-all duration-500">
                    Simulate habitability based on your changes
                  </div>
                  <div className="p-4 bg-sky-500/20 rounded-xl text-center hover:scale-105 transition-all duration-500">
                    Learn how conditions affect the potential for life
                  </div>
                </div>
              </div>
              <p className="p-4">
                Whether you're a space enthusiast, a student, or just curious
                about the cosmos - this is your chance to play with the building
                blocks of life on a planetary scale.
              </p>
              <p className="p-4">
                Join us on this cosmic journey and see how your version of an
                alien world could one day be home.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
