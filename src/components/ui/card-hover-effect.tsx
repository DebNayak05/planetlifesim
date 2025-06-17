import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    imageUrl: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10 justify-center text-center items-center",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          {/* <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card> */}
          <Card
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  title,
  description,
  imageUrl,
}: {
  className?: string;
  title: string;
  description: string;
  imageUrl: string;
}) => {
  return (
    <div
      className="relative h-80 w-full rounded-2xl p-2 border-white/[0.2] border-2 overflow-hidden z-20"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out 
                  group-hover:-translate-x-full z-10"
      >
        <h2 className="text-white text-2xl font-semibold backdrop-blur-2xl rounded-2xl p-1">
          {title}
        </h2>
      </div>

      {/* Description: Slides in from right on hover */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-[#0000002c] backdrop-blur-sm rounded-2xl p-4
                  translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-in-out z-20"
      >
        <p className="text-white text-base text-center">{description}</p>
      </div>
    </div>
  );
};
