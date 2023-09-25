"use client";

import React, { useState } from "react";
import Image from "next/image";
import NavbarLinks from "./NavbarLinks";
import MobileNavbarLinks from "./MobileNavbarLinks";

function Navbar({session}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const toggleMenu = () => setIsMenuOpened(!isMenuOpened);

  return (
    <div className="bg-white p-[2px] border-b border-gray-100 fixed w-full z-20 shadow-sm">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center sm:mx-16 mx-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center cursor-pointer">
            <Image
              src="/logos/neccSticker.png"
              alt="Logo NECC"
              width={100}
              height={100}
              className="w-20 h-20"
            />
            <div className="text-[#018ccb] text-lg sm:text-2xl font-semibold">
              NECChange
            </div>
          </div>

          <div
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-10 h-10 sm:hidden border mx-5 cursor-pointer hover:bg-gray-100 rounded"
          >
            <div className="w-5/12 h-[2px] rounded bg-black m-[1px]"></div>
            <div className="w-5/12 h-[2px] rounded bg-black m-[1px]"></div>
            <div className="w-5/12 h-[2px] rounded bg-black m-[1px]"></div>
          </div>

          <NavbarLinks containerDinamicClass="hidden items-center" session={session}/>
        </div>

        <MobileNavbarLinks isMenuOpened={isMenuOpened} session={session}/>
      </div>
    </div>
  );
}

export default Navbar;