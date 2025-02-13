"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignIn } from "./sign-in";
interface NavbarProps {
  items: { name: string; link: string }[];
}

const items = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-gray-800 text-white fixed top-0 left-0 z-10">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Navbar</h1>
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleNavbar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>
      <nav className={`md:flex ${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="flex flex-col md:flex-row md:space-x-4">
          <SignIn />
          {items.map((item, index) => (
            <li key={index} className="p-2 hover:bg-gray-700">
              <Link href={item.link}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
