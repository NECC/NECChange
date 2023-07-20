import React, { useEffect, useState } from "react";
import { FiChevronRight } from 'react-icons/fi';
import { FeedPostI } from "@/app/feed/interface";
import { FilterI } from "../filters/interface";

interface FeedPostProps {
    postsArray: Array<FeedPostI>,
    yearFilters: FilterI,
}

export default function FeedPost(props: FeedPostProps) {
    const { postsArray, yearFilters } = props;
    const [filteredArray, setFilteredArray] = useState<FeedPostI[]>(postsArray);
    
    const filterData = () => {
        const objectToBeFiltered = Object.entries(yearFilters);
        
        console.log(objectToBeFiltered);
        
        const filteredArrayData = postsArray.filter((post) => {
            return objectToBeFiltered[post.studentYear - 1][1]
        })

        setFilteredArray(filteredArrayData);
    }
    

    
    const [pageMounted, setPageMounted] = useState(true);
    useEffect(() => {
        // This will avoid first renderization of useEffect, stopping the first filtering
        if (pageMounted) {
            setPageMounted(false);
            return;
        }
        filterData();
    }, [yearFilters])

    // 1°, 2°, 3°, 4°, 5° ano
    const yearColor = [ 'text-green-500', 'text-blue-500', 'text-red-500', 'text-purple-500', 'text-orange-500' ];

    return (
        <div className="flex flex-col flex-grow px-12 overflow-auto">
            {filteredArray.map((post) => (
                <div className="border-b">
                    <div key={post.tradeID} className="rounded-xl bg-white border border-black border-black/25 m-3 my-4 shadow-lg relative flex flex-col">
                        <span className="absolute right-0 mr-3 mt-1 text-sm">
                            {post.timePassed > 0 ? `há ${post.timePassed} horas atrás` : `há menos de 1 hora`}
                        </span>
                        <div className="p-4 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white border flex justify-center items-center">
                                {post.profilePic}
                            </div>
                            <span className="ml-2 text-[1.9em]">
                                {post.displayName} (A{post.studentNumber}) -
                            </span>
                            <span className={`ml-1 text-[1.3em] ${yearColor[post.studentYear - 1]}`}>
                                {post.studentYear}°Ano
                            </span>
                        </div>
                        <span className="px-4 pb-4">
                            {post.displayName} solicitou uma troca de turno da UC <strong>{post.fromUC}</strong>
                        </span>
                        <div className="flex justify-start p-4 items-center">
                            <div className="w-10 h-10 rounded-full border flex justify-center items-center mr-1 bg-red-500 border-black">
                                <span className="text-white">TP{post.fromType}</span>
                            </div>
                            <div className="text-black">
                                <FiChevronRight size={24} />
                            </div>
                            <div className="w-10 h-10 rounded-full border flex justify-center items-center m1-2 bg-green-500 border-black">
                                <span className="text-white">TP{post.fromShift}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 mb-4 mr-4 flex justify-end text-sm border-black/25 shadow-lg hover:bg-gray-100 rounded-lg">
                            <button className="py-2 px-3 rounded-lg border">Aceitar Troca</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

