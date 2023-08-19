"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import FeedPost from "@/app/components/Feed/Feed-Posts/FeedPost";
import Sidebar from "@/app/components/Feed/Sidebar/Sidebar";
import Loader from "../components/globals/Loader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FeedBack{
  message: string,
  show: boolean,
  error: boolean
}

export default function Feed() {
  const { data: session } = useSession();

  const [loader, setLoader] = useState(false);

  const [ucsFilter, setUcsFilter] = useState<string[]>([]);
  const [ucsArray, setUcsArray] = useState<string[]>([]);

  const [feedPosts, setFeedData] = useState<any>([]);
  const [dbCursor, setDbCursor] = useState<any>([])

  const [filteredPosts, setFilteredPosts] = useState<any>([]);
  const [myTrades, setMyTrades] = useState<boolean>(false)

  const toggleLoader = (value: boolean) => {
    console.log("Changing");
    setLoader(value);
  }


  useEffect(() => {        
    if(session){
        const uc_names = async () => {
            try {
                axios.get(`api/info/${session?.user?.number}`).then((res) => {
                  setUcsArray(res.data.student_classes);
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        uc_names()
  }
  }, [session]);

  useEffect(() => {
      const startingFeed = async () => {
          try {
              let query_filtered_ucs = ucsFilter.join('&');
              query_filtered_ucs = encodeURIComponent(query_filtered_ucs)
              console.log(query_filtered_ucs);

              axios.get(`api/feed/feed_post/landing/${2}${myTrades ? `/${session?.user?.number}` : '/undefined'}/${query_filtered_ucs}`).then((res) => {
                setDbCursor(res.data.cursor);
                setFeedData(res.data.response);
              })
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      startingFeed();
  }, [session, ucsFilter, myTrades]);

  useEffect(() => {        
      if(ucsFilter.length == 0){            
        setFilteredPosts(feedPosts)
      }
      else{
        setFilteredPosts(feedPosts.filter((feedPost: any) =>
          feedPost.trade_id.some((tradeId: { lessonFrom: { course: { name: string; }; }; }) => ucsFilter.includes(tradeId.lessonFrom.course.name))
        ))
      }
  }, [ucsFilter, feedPosts]);

  const getMorePosts = async () => {
      try {
          let query_filtered_ucs = ucsFilter.join('&');
          query_filtered_ucs = encodeURIComponent(query_filtered_ucs)
          console.log("dbCursor", dbCursor);
          axios.get(`api/feed/feed_post/${2}/${dbCursor}${myTrades ? `/${session?.user?.number}` : '/undefined'}/${query_filtered_ucs}`).then((res) => {
              if (res.data.response.length > 0) {
                  setDbCursor(res.data.cursor);
                  setFeedData([...feedPosts, ...res.data.response])
              }
          })
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }


  return (
    <div className="pt-[85px] h-screen border-red-700 flex bg-white text-black text-lg overflow-auto">
      <Sidebar
        setUcsFilter={setUcsFilter}
        ucsArray={ucsArray}
        ucsFilter={ucsFilter}
        student_nr={session?.user?.number}
        myTrades={myTrades}
        setMyTrades={setMyTrades}
        toggleLoader={toggleLoader}
      />
      <div className="flex flex-col flex-grow px-12 mt-6">
        {filteredPosts.map((feedPost: any, i: any) => {
          return <FeedPost key={i} post={feedPost} toggleLoader={toggleLoader}/>;
        })}
        <div className="flex p-8 m-4 ml-10">
          <button
            className="p-2 px-4 m-2 ml-auto mr-auto rounded-full bg-[#018ccb] hover:bg-[#007cb6]"
            onClick={getMorePosts}
          >
            <FontAwesomeIcon
              icon={faArrowDownLong}
              style={{ color: "white" }}
            />
          </button>

        </div>
      </div>
      <div className="mr-16 mt-10 w-40 h-20">
        {
        /*
          Acho que o card a ocupar o ecrã todo fica feio
        */
        }
      
      </div>
      {loader && <Loader />}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}