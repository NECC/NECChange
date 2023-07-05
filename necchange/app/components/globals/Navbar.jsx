import React from "react";
import Image from "next/image";

function Navbar() {
  return (
    <div className="bg-white p-[2px] border-b border-gray-100 sticky w-full z-50 shadow-sm">
      <div className="flex justify-between items-center mr-12 ml-12">
        <div className="flex items-center cursor-pointer">
          <Image src="/neccSticker.png" alt="Logo NECC" width={100} height={100} className="w-20 h-20"/>
          <div className="text-[#018ccb] text-2xl font-semibold">NECChange</div>
        </div>
        <ul className="flex items-center space-x-2 text-gray-800 font-semibold">
          <li>
            <a className="hover:bg-gray-100 px-3 py-2 rounded-md" href="/trades">Trocas</a>
          </li>
          <li>
            <a className="hover:bg-gray-100 px-3 py-2 rounded-md" href="/trades">Calendário</a>
          </li>
          <li className="px-3">
            <img
              src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?cs=srgb&dl=pexels-justin-shaifer-1222271.jpg&fm=jpg"
              alt="Logo Necc"
              className="w-10 h-10 rounded-full shadow-md"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
