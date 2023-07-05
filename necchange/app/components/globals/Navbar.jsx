import React from "react";
import Image from "next/image";

function Navbar() {
  return (
    <div className="bg-white p-[2px] border-b border-black fixed w-full z-50 shadow-lg">
      <div className="flex justify-between items-center mr-12 ml-12">
        <div className="flex items-center cursor-pointer">
          <Image src="/neccSticker.png" alt="Logo NECC" width={100} height={100} className="w-20 h-20"/>
          <div className="text-black text-2xl">NECChange</div>
        </div>
        <ul className="flex  items-center space-x-4 text-black font-semibold">
          <li>
            <a href="/trades">Trocas</a>
          </li>
          <li>
            <a href="/trades">Calendário</a>
          </li>
          <li>
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
