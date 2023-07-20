'use client'
import { FeedPostI } from "./interface";
import FeedPost from "@/app/components/trades/feed-posts/FeedPosts";

export default function Feed() {

    /* Class types */
    // 1 -> T
    // 2 -> TP
    // 3 -> PL

    const feedData: Array<FeedPostI> = [
        {
            fromUC: "Laboratórios de Algoritmia I",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Laboratórios de Algoritmia I", 
            toType: 2,
            toShift: 1,
            tradeID: 1,
            studentNumber: 102504,
            displayName: "Pedro Camargo",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
        }
    ]

    return (
        <div className="pt-24 p-6 h-screen border-red-700 flex justify-center bg-white text-black text-sm">
            <div className="border-l">
                <FeedPost postsArray={feedData}/>
            </div>
            
            <div className="border-r">

            </div>
            
        </div>
    );
}