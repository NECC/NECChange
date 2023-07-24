'use client'
import { useState, useEffect } from "react";
import { FilterI } from "../components/trades/filters/interface";
import { FeedPostI } from "./interface";
import { UnidadesCurricularesI } from "./interface";

import FeedPost from "@/app/components/trades/feed-posts/FeedPost";
import Filters from "@/app/components/trades/filters/Filters";
import axios from "axios";

export default function Feed() {
    const student_nr = 'A182920';
    const [ucsFilter, setUcsFilter] = useState<UnidadesCurricularesI>({});
    const [yearFilter, setYearFilter] = useState<FilterI>({
        ano1: false,
        ano2: false,
        ano3: false,
    })
    const [ucsArray, setUcsArray] = useState<string[]>([]);



    const [feedPosts, setFeedData] = useState([]);

    useEffect(() => {
        const startingFeed = async () => {
            try {
                axios.get('api/feed/feed_post').then((res) => {
                    setFeedData(res.data.response);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        startingFeed();
    }, []);

    return (
        <div className="pt-[85px] h-screen border-red-700 flex bg-white text-black text-lg">
            <Filters yearFilter={yearFilter} setYearFilter={setYearFilter} setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
            {
                <div className="flex flex-col flex-grow px-12 overflow-auto">
                    {
                        feedPosts.map((feedPost, i) =>{
                            console.log(feedPost)
                            return(
                                <FeedPost key={i} post={feedPost}/>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
}