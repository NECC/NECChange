import React, { useEffect, useState } from "react";
import { FiChevronRight } from 'react-icons/fi';
import { FeedPostI, UnidadesCurricularesI } from "@/app/feed/interface";
import { FilterI } from "../filters/interface";

interface FeedPostProps {
    postsArray: Array<FeedPostI>,
    yearFilters: FilterI,
    ucsFilters: UnidadesCurricularesI,
}

export default function FeedPost(props: FeedPostProps) {
    const { postsArray, yearFilters, ucsFilters } = props;
    const filtersAmount = 2; // Quantity of filters in the page to avoid overmounting the page
    const [filteredArray, setFilteredArray] = useState<FeedPostI[]>(postsArray);

    // 1°, 2°, 3°, 4°, 5° ano
    const yearColor = [ 'text-green-500', 'text-blue-500', 'text-red-500', 'text-purple-500', 'text-orange-500' ];
    
    // This function checks if any radio button in "Ano" is checked
    // If checked, the feed filter will be around Ano
    // If not checked yet, the others checkboxes will apply the filter in feed posts
    const checkIfSelected = (objectToBeFiltered: [string, any][]) => objectToBeFiltered.some((item) => item[1]);

    const filterData = () => {
        const objectToBeFiltered = Object.entries(yearFilters);
        let filteredArrayData = [];

        if (checkIfSelected(objectToBeFiltered)) {
            filteredArrayData = filterYearsData(objectToBeFiltered);

            // Debug
            //console.log("FilteredArrayData: ", filteredArrayData);

        } else filteredArrayData = postsArray;
        
        filteredArrayData = filterUcsData(filteredArrayData);

        setFilteredArray(filteredArrayData);
    }

    const filterYearsData = (objectToBeFiltered: [string,any][]) => postsArray.filter((post) => (objectToBeFiltered[post.studentYear - 1][1]));

    const filterUcsData = (array: FeedPostI[]) => {
        const objectToBeFiltered = Object.entries(ucsFilters);
        const filteredArrayData = objectToBeFiltered.filter((uc) => uc[1]).map((uc) => uc[0]);
        const finalFilteredArray = array.filter((item) => filteredArrayData.includes(item.dataFrom));

        // setFilteredArray(finalFilteredArray);
        const years = filterYearsData(Object.entries(yearFilters))
        return finalFilteredArray.length > 0 ? finalFilteredArray : years.length > 0 ? years : postsArray;
    }
    
    let [mountingAmount, setMountingAmount] = useState(0);
    useEffect(() => {
        setMountingAmount(mountingAmount + 1);
        // This will avoid first renderization of useEffect, stopping the first filtering
        if (mountingAmount < filtersAmount) {
            return;
        }

        filterData();
    }, [yearFilters, ucsFilters]);



    return (
        <div className="flex flex-col flex-grow px-12 overflow-auto">
            {filteredArray.map((post) => (
                <div className="border-b" key={post.tradeID}>
                    <div className="rounded-xl bg-white border border-black border-black/25 m-3 my-4 shadow-lg relative flex flex-col">
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

