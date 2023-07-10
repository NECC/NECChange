'use client'

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


export default function Trade() {
    return (
        <div className="group text-center bg-blue-500 p-6 rounded-lg relative mt-2 w-full">
            <div className="text-white text-2xl flex justify-between items-center">
                <div className="flex-1 truncate text-left font-popUp">Laboratórios de algoritmia I</div>
                <span className="font-popUp font-bold">- TP2</span>

                <div className="px-8 text-4xl"><FontAwesomeIcon icon={faArrowRight} size="lg" /></div>

                <div className="flex-1 truncate text-left font-popUp">Laboratórios de Algoritmia I</div>
                <span className="font-popUp font-bold">- TP2</span>
            </div>

            <div className="flex bg-white/0 w-full h-full rounded-xl justify-end absolute right-0 top-1/2 -translate-y-1/2 pr-4 group-hover:backdrop-blur-sm transition-all duration-150">
                <button className="text-4xl hidden group-hover:block px-4 py-1 rounded text-black/90">
                    <FontAwesomeIcon icon={faPencilAlt}  />
                </button>
                <button className="text-4xl hidden group-hover:block px-4 py-1 rounded text-black/90">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>


        </div>
    );
}