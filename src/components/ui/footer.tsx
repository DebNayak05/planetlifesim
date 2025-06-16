import React from "react";
import Link from "next/link";

const Footer = () => {
  const items = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/#about",
    },
    {
      title: "Explore ExoCosmos",
      href: "/checkoutPlanets",
    },
    {
      title: "Terms of Service",
      href: "/terms-of-service",
    },
    // {
    //   title: "Questions",
    //   href: "/questions",
    // },
  ];
  return (
    <footer className="bg-white shadow-sm dark:bg-transparent min-w-screen">
      <div className="min-w-screen max-w-screen-xl mx-auto md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between p-4">
          <Link
            href={"/"}
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ExoCosmos
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-white">
            {items.map((item, index) => {
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:underline me-4 md:me-6"
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <Link href="/" className="hover:underline">
            ExoCosmos™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
