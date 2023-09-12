"use client";
import { useState, useEffect, MouseEventHandler } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import FeedPost from "@/app/components/Feed/Feed-Posts/FeedPost";
import Loader from "../components/globals/Loader";

import { FaPlus } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UCFilter from "@/app/components/Feed/Sidebar/Filters/UCFilter";
import NewTradeButton from "@/app/components/Feed/Sidebar/NewTrade/NewTradeButton";

interface PostsI{
  filteredPosts: Array<any>,
  toggleLoader: Function,
  getMorePosts: MouseEventHandler<HTMLButtonElement>
}

const Posts = ({filteredPosts, toggleLoader, getMorePosts}: PostsI) => {
  return(
    <div>
      <div className="w-full grid gap-6 mb-8">
        {filteredPosts.map((feedPost: any, i: any) => {
          return (
            <FeedPost key={i} post={feedPost} toggleLoader={toggleLoader} />
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          className="flex items-center gap-2 rounded-full bg-blue-500 py-2 px-4 text-base capitalize font-semibold text-white"
          onClick={getMorePosts}
        >
          <FaPlus /> carregar mais
        </button>
      </div>
    </div>
  )
}

const TradesClosed = () => {
  return(
    <div className="w-full mt-16 p-12 border rounded-md shadow-md  text-center font-bold text-blue-600">
      A época de trocas encontra-se fechada.
    </div>
  )
}



export default function Feed(){
  const { data: session } = useSession();
  const [tradesOpen, setTradesOpen] = useState<any>(null)

  const [loader, setLoader] = useState(false);

  const [ucsFilter, setUcsFilter] = useState<string[]>([]);
  const [ucsArray, setUcsArray] = useState<string[]>([]);

  const [feedPosts, setFeedData] = useState<any>([]);
  const [dbCursor, setDbCursor] = useState<any>(1);

  const [filteredPosts, setFilteredPosts] = useState<any>([]);
  const [myTrades, setMyTrades] = useState<boolean>(false);

  const toggleLoader = (value: boolean) => {
    setLoader(value);
  };

  // This effect checks if trade period is open
  useEffect(() =>{
    const checkTradePeriod = () =>{
      axios
        .get('/api/feed/feed_post/trade_period_info')
        .then(res =>{
          setTradesOpen(res.data.open)
          console.log(res);
        })
        .catch(err => console.log(err))
    }

    checkTradePeriod()
  }, [tradesOpen]);
  
  // This effect gets the courses that the student is taking
  useEffect(() => {
    if (session) {
      const uc_names = async () => {
        try {
          axios.get(`api/info/${session?.user?.number}`).then((res) => {
            setUcsArray(res.data.student_classes);
            console.log(res.data.student_classes);
            console.log(session);
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      uc_names();
    }
  }, [session]);

  // This effect is responsible to get the first posts that show on feed
  useEffect(() => {
    const startingFeed = async () => {
      try {
        let query_filtered_ucs = ucsFilter.join("&");
        query_filtered_ucs = encodeURIComponent(query_filtered_ucs);
        console.log(query_filtered_ucs);

        axios
          .get(
            `api/feed/feed_post/${5}/landing/${
              myTrades ? `/${session?.user?.number}` : "/undefined"
            }/${query_filtered_ucs}`
          )
          .then((res) => {
            setDbCursor(res.data.cursor);
            setFeedData(res.data.response);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    if(tradesOpen) startingFeed();
  }, [session, ucsFilter, myTrades]);

  // This effect filters the posts already taken
  useEffect(() => {
    if (ucsFilter.length == 0) {
      setFilteredPosts(feedPosts);
    } else {
      setFilteredPosts(
        feedPosts.filter((feedPost: any) =>
          feedPost.trade_id.some(
            (tradeId: { lessonFrom: { course: { name: string } } }) =>
              ucsFilter.includes(tradeId.lessonFrom.course.name)
          )
        )
      );
    }
  }, [ucsFilter, feedPosts]);

  // This function gets more posts from the database
  const getMorePosts = async () => {
    try {
      let query_filtered_ucs = ucsFilter.join("&");
      query_filtered_ucs = encodeURIComponent(query_filtered_ucs);
      console.log("dbCursor", dbCursor);
      axios
        .get(
          `api/feed/feed_post/${5}/${dbCursor}${
            myTrades ? `/${session?.user?.number}` : "/undefined"
          }/${query_filtered_ucs}`
        )
        .then((res) => {
          if (res.data.response.length > 0) {
            setDbCursor(res.data.cursor);
            setFeedData([...feedPosts, ...res.data.response]);
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-20 flex justify-center bg-white text-gray-900">
      <div className="flex flex-col items-center mx-5 w-full max-w-4xl">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 text-base font-semibold text-gray-900 mb-8">
          <div className="border-b w-full sm:w-auto grid grid-cols-2">
            <button
              className={`w-full sm:w-auto py-2 px-3 text-center transition duration-200 border-b-2 ${
                myTrades
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setMyTrades(true)}
            >
              Pessoais
            </button>
            <button
              className={`w-full sm:w-auto py-2 px-3 text-center transition duration-200 border-b-2 ${
                myTrades
                  ? "border-transparent text-gray-700 hover:border-gray-300"
                  : "border-blue-500 text-gray-900"
              }`}
              onClick={() => setMyTrades(false)}
            >
              Tudo
            </button>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <UCFilter
              setUcsFilter={setUcsFilter}
              ucsArray={ucsArray}
              ucsFilter={ucsFilter}
            />
            {
              tradesOpen 
              ? 
              <div className="flex-grow">
                <NewTradeButton toggleLoader={toggleLoader} />
              </div>
              : 
              <></>
            }
          </div>
        </div>
        { tradesOpen 
          ? <Posts filteredPosts={filteredPosts} toggleLoader={toggleLoader} getMorePosts={getMorePosts}/>
          : (tradesOpen == false) 
              ? <TradesClosed/>
              : <></> 
        }
      </div>


      {/* Loader and Toast Components */}
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