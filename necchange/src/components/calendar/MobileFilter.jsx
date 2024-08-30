"use client"

import { useState } from "react";
import CheckboxTree from './CheckboxTree/CheckboxTree';
import { Button } from "@nextui-org/react";
import FilterIcon from '../FilterIcon';

export default function MobileFilter(props) {
    const { className, nodes, checked, onCheck } = props;
    const [isOpened, setIsOpened] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpened(!isOpened)} color="primary" size="lg" startContent={<FilterIcon/>} className="absolute bottom-12 right-6 z-50 lg:hidden">
                Filtrar
            </Button>
            <div className={`absolute w-full h-full transition-all duration-500 ${isOpened ? 'left-0' : '-left-[100%]'} top-0 z-10 bg-white/90 flex justify-center items-start mt-16 mb-24 overflow-auto`}>
                <CheckboxTree
                    className="container mx-5 mt-10"
                    nodes={nodes}
                    checked={checked}
                    onCheck={onCheck}
                />
            </div>
        </>
    );
}