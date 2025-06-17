"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
export default function Navbar({ className }: { className?: string }) {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (scrollY > lastScrollY) {
        //direction down
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      setScrolledEnough(scrollY > 10);
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);
  return (
    <nav
      className={cn(
        `fixed top-0 w-full z-50 p-4 text-white transition-all duration-500 ${
          scrolledEnough ? "bg-gray-800/50" : "bg-black"
        } ${
          scrollDirection === "down"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`,
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-xl font-bold">ExoCosmos</span>
        <div className="space-x-6">
          <Link className="hover:underline" href="/checkoutPlanets">
            Explore Planets
          </Link>
          <Link href="#about" className="hover:underline">
            About ExoCosmos
          </Link>
        </div>
      </div>
    </nav>
  );
}
