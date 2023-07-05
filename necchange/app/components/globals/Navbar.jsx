import React from "react";

function Navbar() {
  return (
    <div className="bg-white p-2 border-b-2 border-black">
      <div className="flex justify-between items-center mr-12 ml-12">
        <div className="flex items-center">
          <img
            src="https://necc.di.uminho.pt/_ipx/w_640,q_75//store/stickers/sticker_necc.png?url=/store/stickers/sticker_necc.png&w=640&q=75"
            alt="Logo Necc"
            className="w-20 h-20"
          />
          <div className="text-black text-2xl">NECChange</div>
        </div>
        <ul className="flex  items-center space-x-4 text-black">
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
              className="w-10 h-10 rounded-full"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
