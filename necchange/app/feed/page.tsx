'use client'
import { useState } from "react";
import { FilterI } from "../components/trades/filters/interface";
import { FeedPostI } from "./interface";
import FeedPost from "@/app/components/trades/feed-posts/FeedPosts";
import Filters from "@/app/components/trades/filters/Filters";

export default function Feed() {

    /* Class types */
    // 1 -> T
    // 2 -> TP
    // 3 -> PL

    const feedData: Array<FeedPostI> = [
        {
            fromUC: "Sistemas de Computação",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Sistemas de Computação", 
            toType: 2,
            toShift: 1,
            tradeID: 1,
            studentNumber: 102399,
            displayName: "Joao Dias",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
        },
        {
            fromUC: "Laboratórios de Algoritmia I",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Laboratórios de Algoritmia I", 
            toType: 2,
            toShift: 1,
            tradeID: 2,
            studentNumber: 102504,
            displayName: "Pedro Camargo",
            studentYear: 1,
            timePassed: 0,
            profilePic: 'PC',
        },
        {
            fromUC: "Koe",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Koe", 
            toType: 2,
            toShift: 1,
            tradeID: 3,
            studentNumber: 696969,
            displayName: "Teste",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
        },
        {
            fromUC: "Koe",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Koe", 
            toType: 2,
            toShift: 1,
            tradeID: 4,
            studentNumber: 696969,
            displayName: "Teste",
            studentYear: 3,
            timePassed: 0,
            profilePic: 'PC',
        },
        {
            fromUC: "Koe",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Koe", 
            toType: 2,
            toShift: 1,
            tradeID: 5,
            studentNumber: 696969,
            displayName: "Teste",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
        }
    ]

    const [yearFilter, setYearFilter] = useState<FilterI>({
        ano1: false,
        ano2: false,
        ano3: false,
        ano4: false,
        ano5: false,
    })

    return (
        <div className="pt-[85px] h-screen border-red-700 flex justify-center bg-white text-black text-sm">
            <Filters filter={yearFilter} setFilter={setYearFilter}/>
            <FeedPost postsArray={feedData} yearFilters={yearFilter}/>
        </div>
    );
}