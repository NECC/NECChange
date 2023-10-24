"use client"

import { FaFilter } from 'react-icons/fa'
import { LuListFilter } from 'react-icons/lu'
import { useState } from "react";

export default function MobileFilter(props) {
    const { className } = props;
    const [isOpened, setIsOpened] = useState(false);



    return (
        <div className={`absolute bg-white border shadow-md bottom-6 z-50 left-6 w-16 h-16 rounded-full flex justify-center items-center ${className}`}>
            <div className='flex flex-col justify-center items-center'>
                {/* <FaFilter className='text-black text-xl'/> */}
                <LuListFilter className='text-black text-xl'/>
                <span className='text-xs pt-1'>Filter</span>
            </div>
        </div>
    );
    
}