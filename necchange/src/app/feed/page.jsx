"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import FeedPost from "@/components/Feed/Feed-Posts/FeedPost";
import Loader from "@/components/globals/Loader";

import { FaPlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UCFilter from "@/components/Feed/Sidebar/Filters/UCFilter";
import NewTradeButton from "@/components/Feed/Sidebar/NewTradeButton";

const Posts = ({ filteredPosts, toggleLoader }) => {
  return (
    <div className="w-full grid gap-6 mb-8">
      {filteredPosts.map((feedPost, i) => {
        //  console.log("feedPost", feedPost);
        return <FeedPost key={i} post={feedPost} toggleLoader={toggleLoader} />;
      })}
    </div>
  );
};

const TradesClosed = () => {
  return (
    <div className="w-full mt-16 p-12 border rounded-md shadow-md  text-center font-bold text-blue-600">
      A época de trocas encontra-se fechada.
    </div>
  );
};

export default function Feed() {
  const { data: session } = useSession();
  const [tradesOpen, setTradesOpen] = useState(null);

  const [loader, setLoader] = useState(false);

  const [ucsFilter, setUcsFilter] = useState([]);
  const [ucsArray, setUcsArray] = useState([]);

  const [feedPosts, setFeedData] = useState([]);
  const [dbCursor, setDbCursor] = useState(1);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [myTrades, setMyTrades] = useState(false);

  const toggleLoader = (value) => {
    setLoader(value);
  };

  // This effect checks if trade period is open
  useEffect(() => {
    const checkTradePeriod = () => {
      axios
        .get("/api/feed/feed_post/trade_period_info")
        .then((res) => {
          setTradesOpen(res.data.open);
        })
        .catch((err) => console.log(err));
    };

    checkTradePeriod();
  }, []);

  // This effect is responsible to get the first posts that show on feed
  useEffect(() => {
    const startingFeed = async () => {
      try {
        toggleLoader(true);
        axios
          .get(
            `/api/feed/feed_post/${5}/landing/${
              myTrades ? `/ ${session?.user?.number}` : "/undefined"
            }`
          )
          .then((res) => {
            setDbCursor(res.data.cursor);
            setFeedData(res.data.response);
            toggleLoader(false);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        toggleLoader(false);
      }
    };

    if (tradesOpen) startingFeed();
  }, [session, tradesOpen]);

  // This effect filters the posts already taken
  useEffect(() => {
    let posts = [];
    // No filters, choose between personal or everything
    if (ucsFilter.length == 0) {
      posts = feedPosts.filter((feedPost) =>
        myTrades ? feedPost.from_student.number == session.user.number : true
      );

      // With filters (this body can be optimized)
    } else {
      posts = feedPosts.filter(
        (feedPost) =>
          ucsFilter.every((uc) =>
            feedPost.trade_id
              .map((trade) => trade.lessonFrom.course.name)
              .includes(uc)
          ) &&
          (myTrades
            ? feedPost.from_student.number == session.user.number
            : feedPost.from_student.number != session.user.number)
      );
    }

    let new_cursor = 0;
    const post_ids = posts.map((post) => post.id);
    new_cursor = post_ids.length == 0 ? 1 : Math.max(...post_ids);
    setDbCursor(new_cursor);
    setFilteredPosts(posts);
  }, [myTrades, ucsFilter, feedPosts]);

  // This function gets more posts from the database
  const getMorePosts = async () => {
    toggleLoader(true);
    try {
      let query_filtered_ucs = ucsFilter.join("&");
      query_filtered_ucs = encodeURIComponent(query_filtered_ucs);
      //console.log(dbCursor);
      axios
        .get(
          `/api/feed/feed_post/${5}/${dbCursor}${
            myTrades ? `/${session?.user?.number}` : "/undefined"
          }/${query_filtered_ucs}`
        )
        .then((res) => {
          if (res.data.response.length > 0) {
            setDbCursor(res.data.cursor);
            setFeedData([...feedPosts, ...res.data.response]);
          } else {
            toast.warning("Não há mais posts, de momento.");
          }
          toggleLoader(false);
        });
    } catch (error) {
      toggleLoader(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight =
        e.target.documentElement.scrollTop + window.innerHeight;

      if (currentHeight + 1 >= scrollHeight) {
        getMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [getMorePosts]);

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
              session={session}
              setUcsFilter={setUcsFilter}
              setUcsArray={setUcsArray}
              ucsArray={ucsArray}
              ucsFilter={ucsFilter}
            />
            {tradesOpen ? (
              <div className="flex-grow">
                <NewTradeButton toggleLoader={toggleLoader} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {tradesOpen ? (
          <Posts
            filteredPosts={filteredPosts}
            toggleLoader={toggleLoader}
          />
        ) : tradesOpen == false ? (
          <TradesClosed />
        ) : (
          <></>
        )}
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
