"use client";

import Link from "next/link";
import { FiX } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, MouseEvent } from "react";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleNav = (event?: MouseEvent) => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <header className="header bg-white px-10 py-6 flex items-center justify-between shadow shadow-[#0000000f] z-10 relative">
        <Link
          href="/"
          className="logo text-2xl md:text-3xl font-bold text-black"
        >
          Prompts<span className="font-bold text-[#673DE6]">Master!</span>
        </Link>
        <nav>
          <ul className="menuItems gap-4 text-black hidden lg:flex">
            <li>
              <Link href="/prompts" className="font-normal text-base">
                <span className="hover:text-blue-800">Test Prompts</span>{" "}
                &nbsp;|
              </Link>
            </li>
            <li>
              <Link href="/prompts/analyze" className="font-normal text-base">
                <span className="hover:text-blue-800">Analyze</span> &nbsp;|
              </Link>
            </li>
            <li>
              <Link href="/prompts/batch" className="font-normal text-base">
                <span className="hover:text-blue-800">Batch Test</span> &nbsp;|
              </Link>
            </li>
            <li>
              <Link
                href="/prompts/variations"
                className="font-normal text-base"
              >
                <span className="hover:text-blue-800">Prompts Variations</span>{" "}
                &nbsp;|
              </Link>
            </li>
            <li>
              <Link href="/prompts/templates" className="font-normal text-base">
                <span className="hover:text-blue-800">Prompts Templates</span>
              </Link>
            </li>
          </ul>
        </nav>
        <Link
          href="/prompts/playground"
          className="hidden text-white px-4 py-2 bg-[#673DE6] rounded-3xl lg:block hover:bg-[#4f32a7]"
        >
          Playground
        </Link>
        <GiHamburgerMenu className="lg:hidden text-2xl" onClick={handleNav} />

        {/* Mobile Nav */}
        <div
          className={
            isOpen
              ? "fixed inset-0 bg-white z-[9999] w-screen h-screen lg:hidden"
              : "hidden"
          }
        >
          <div className="w-full h-full flex flex-col">
            <div className="mobileHeader px-10 py-6 flex items-center justify-between shadow-sm shadow-[#00000022] z-10">
              <Link
                href="/"
                onClick={handleNav}
                className="logo text-2xl md:text-3xl font-bold text-black"
              >
                Prompts<span className="font-bold text-[#5025D1]">Master!</span>
              </Link>
              <div className="mobileSubmenu flex items-end justify-end">
                <div className="closeBar">
                  <button
                    onClick={handleNav}
                    className="rounded-full font-extrabold text-black text-2xl"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            </div>
            <div className="mainHead flex-1 flex items-center justify-center">
              <div className="menu">
                <ul className="text-center text-xl font-bold">
                  <li className="py-1">
                    <Link onClick={handleNav} href="/prompts">
                      Test Prompts
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link onClick={handleNav} href="/prompts/analyze">
                      Analyze
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link onClick={handleNav} href="/prompts/batch">
                      Batch Test
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link onClick={handleNav} href="/prompts/variations">
                      Prompts Variations
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link onClick={handleNav} href="/prompts/templates">
                      Prompts Templates
                    </Link>
                  </li>
                  <li className="pt-4">
                    <Link
                      href="/prompts/playground"
                      onClick={handleNav}
                      className="text-base text-white px-4 py-2 shadow-2xl bg-[#673DE6] rounded-md lg:block"
                    >
                      Playground
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
