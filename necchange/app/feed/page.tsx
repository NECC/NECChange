'use client'
import { useState, useEffect } from "react";
import { FilterI } from "../components/trades/filters/interface";
import { FeedPostI } from "./interface";
import { UnidadesCurricularesI } from "./interface";

import FeedPost from "@/app/components/trades/feed-posts/FeedPost";
import Filters from "@/app/components/trades/filters/Filters";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";


export default function Feed() {
    const [ucsFilter, setUcsFilter] = useState<UnidadesCurricularesI>({});
    const [yearFilter, setYearFilter] = useState<FilterI>({ano1: false,ano2: false,ano3: false,})
    const [ucsArray, setUcsArray] = useState<string[]>([]);

    const student_nr = 'A182920';
    const [feedPosts, setFeedData] = useState<any>([]);
    const [dbCursor, setDbCursor] = useState()

    useEffect(() => {
        const startingFeed = async () => {
            try {
                axios.get(`api/feed/feed_post/landing/${2}`).then((res) => {
                    setDbCursor(res.data.cursor);
                    setFeedData(res.data.response);
                    console.log(feedPosts);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        startingFeed();
    }, []);

    const getMorePosts = async () => {
        try{
            console.log(dbCursor);
            axios.get(`api/feed/feed_post/${2}/${dbCursor}`).then((res) => {
                if(res.data.response.length > 0){
                    setDbCursor(res.data.cursor);
                    setFeedData([...feedPosts, ...res.data.response])
                }
            })
        } catch (error){
            console.error('Error fetching data:', error);
        }
    } 

    return (
        <div className="pt-[85px] h-screen border-red-700 flex bg-white text-black text-lg">
            <Filters yearFilter={yearFilter} setYearFilter={setYearFilter} setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
            <div className="flex flex-col flex-grow px-12 overflow-auto">
                {
                    
                    feedPosts.map((feedPost: any, i: any) =>{
                        //console.log(feedPosts)
                        return(
                            <FeedPost key={i} post={feedPost}/>
                        )
                    })
                }
                <div className="flex w-2/3 p-8 m-4 ml-10">
                    <button className="p-2 px-4 m-2 ml-auto mr-auto rounded-full bg-[#018ccb] hover:bg-[#007cb6]" 
                            onClick={getMorePosts}>
                        <FontAwesomeIcon icon={faArrowDownLong} style={{color: "white"}} />
                    </button>
                </div>
            </div>
            
        </div>
    );
}