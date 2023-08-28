"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import FeedPost from "@/app/components/Feed/Feed-Posts/FeedPost";
import Sidebar from "@/app/components/Feed/Sidebar/Sidebar";
import Loader from "../components/globals/Loader";

import { FaPlus } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UCFilter from "@/app/components/Feed/Sidebar/Filters/UCFilter";
import NewTradeButton from "@/app/components/Feed/Sidebar/NewTrade/NewTradeButton";

export default function Feed() {
  const { data: session } = useSession();

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

  useEffect(() => {
    if (session) {
      const uc_names = async () => {
        try {
          axios.get(`api/info/${session?.user?.number}`).then((res) => {
            setUcsArray(res.data.student_classes);
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      uc_names();
    }
  }, [session]);

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
    startingFeed();
  }, [session, ucsFilter, myTrades]);

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
            <div className="flex-grow">
              <NewTradeButton toggleLoader={toggleLoader} />
            </div>
          </div>
        </div>

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
