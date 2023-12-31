"use client"

import { FaFilter } from 'react-icons/fa'
import { LuListFilter } from 'react-icons/lu'
import { useState } from "react";
import CheckboxTree from './CheckboxTree/CheckboxTree';

export default function MobileFilter(props) {
    const { className, nodes, checked, onCheck } = props;
    const [isOpened, setIsOpened] = useState(false);



    return (
        <>
            <div onClick={() => setIsOpened(!isOpened)} className={`group transition-all duration-300 absolute border shadow-md bottom-12 z-50 left-6 w-14 h-14 rounded-full flex justify-center items-center ${className} ${isOpened ? 'bg-black' : 'bg-white'}`}>
                <div className='flex flex-col justify-center items-center'>
                    {/* <FaFilter className='text-black text-xl'/> */}
                    <LuListFilter className={`text-xl ${isOpened ? 'text-white' : 'text-black'}`}/>
                    <span className={`text-xs pt-1 ${isOpened ? 'text-white' : 'text-black'}`}>Filter</span>
                </div>

            </div>
            <div className={`absolute w-full h-full transition-all duration-500 ${isOpened ? 'left-0' : '-left-[100%]'} top-0 z-10 bg-white/90 flex justify-center items-start mt-16 mb-24 overflow-auto`}>   

            <CheckboxTree
                className={`md:w-[440px] w-[350px] ml-5 mt-5 mb-14`}
                nodes={nodes}
                checked={checked}
                onCheck={onCheck}
            />


            </div>
        </>
    );
    
}