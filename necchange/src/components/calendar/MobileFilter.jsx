"use client"

import { FaFilter } from 'react-icons/fa'
import { LuListFilter } from 'react-icons/lu'
import { useState } from "react";

export default function MobileFilter(props) {
    const { className } = props;
    const [isOpened, setIsOpened] = useState(false);



    return (
        <>
            <div onClick={() => setIsOpened(!isOpened)} className={`absolute bg-white border shadow-md bottom-12 z-50 left-6 w-20 h-20 rounded-full flex justify-center items-center ${className}`}>
                <div className='flex flex-col justify-center items-center'>
                    {/* <FaFilter className='text-black text-xl'/> */}
                    <LuListFilter className='text-black text-xl'/>
                    <span className='text-sm pt-1'>Filter</span>
                </div>

            </div>
            <div className={`absolute w-full h-full transition-all duration-500 ${isOpened ? 'left-0' : '-left-[100%]'} top-0 z-10 bg-white/75 flex justify-center items-center`}>   

                

            </div>
        </>
    );
    
}