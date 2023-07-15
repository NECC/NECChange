'use client'
import { FeedPostI } from "@/app/components/trades/interfaces/interfaces";
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
        },
        {
            fromUC: "Sistemas de Computação",     // UC name             
            fromType: 3,    // UC Type
            fromShift: 2,   // UC Shift
            toUC: "Sistemas de Computação", 
            toType: 3,
            toShift: 1,
            tradeID: 2,
            studentNumber: 903845,
            displayName: "Simão Quintela",
            studentYear: 4,
            timePassed: 1,
            profilePic: 'SQ',
        },
        {
            fromUC: "Matemática Discreta",     // UC name             
            fromType: 1,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Matemática Discreta", 
            toType: 1,
            toShift: 2,
            tradeID: 3,
            studentNumber: 100000,
            displayName: "José Bernardo",
            studentYear: 2,
            timePassed: 3,
            profilePic: 'JB',
        },
        {
            fromUC: "Programação Funcional",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Programação Funcional", 
            toType: 2,
            toShift: 2,
            tradeID: 4,
            studentNumber: 100000,
            displayName: "Bruno Jardim",
            studentYear: 5,
            timePassed: 24,
            profilePic: 'BJ',
        },
        {
            fromUC: "Programação Orientada a Objetos",     // UC name             
            fromType: 3,    // UC Type
            fromShift: 3,   // UC Shift
            toUC: "Programação Orientada a Objetos", 
            toType: 3,
            toShift: 1,
            tradeID: 5,
            studentNumber: 100000,
            displayName: "Testando",
            studentYear: 3,
            timePassed: 1,
            profilePic: 'TT',
        },
    ]

    return (
        <div className="pt-24 p-4 h-screen flex ">
            <div className=""></div>

            <FeedPost postsArray={feedData}/>
        </div>
    );
}