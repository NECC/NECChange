"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import FeedPost from "@/components/Feed/Feed-Posts/FeedPost";
import Loader from "@/components/globals/Loader";
import { FaPlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UCFilter from "@/components/Feed/Sidebar/Filters/UCFilter";
import NewTradeButton from "@/components/Feed/Sidebar/NewTradeButton";

const Posts = ({ filteredPosts, toggleLoader, getMorePosts, hasMore, onTradeComplete, isPersonalView }) => {
  return (
    <div>
      <div className="w-full grid gap-6 mb-8">
        {filteredPosts.map((feedPost, i) => {
          return (
            <FeedPost 
              key={feedPost.id} 
              post={feedPost} 
              toggleLoader={toggleLoader}
              isPersonalFeed={isPersonalView}
              onTradeComplete={onTradeComplete}
            />
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {isPersonalView 
            ? "Você não tem trocas registradas." 
            : "Nenhuma troca disponível no momento."}
        </div>
      )}

      {hasMore && filteredPosts.length > 0 && (
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 rounded-full bg-blue-500 py-2 px-4 text-base capitalize font-semibold text-white hover:bg-blue-600 transition"
            onClick={getMorePosts}
          >
            <FaPlus /> carregar mais
          </button>
        </div>
      )}
    </div>
  );
};

const TradesClosed = () => {
  return (
    <div className="w-full mt-16 p-12 border rounded-md shadow-md text-center font-bold text-blue-600">
      A época de trocas encontra-se fechada.
    </div>
  );
};

export default function Feed() {
  const { data: session, status } = useSession();
  const [tradesOpen, setTradesOpen] = useState(null);
  const [loader, setLoader] = useState(false);
  const [ucsFilter, setUcsFilter] = useState([]);
  const [ucsArray, setUcsArray] = useState([]);
  const [feedPosts, setFeedData] = useState([]);
  const [dbCursor, setDbCursor] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [myTrades, setMyTrades] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const toggleLoader = (value) => {
    setLoader(value);
  };

  // Check trade period status
  useEffect(() => {
    const checkTradePeriod = async () => {
      try {
        const res = await axios.get("/api/feed/feed_post/trade_period_info");
        const isOpen = res.data.status?.isOpen ?? false;
        
        if (tradesOpen !== null && tradesOpen !== isOpen) {
          if (isOpen) {
            toast.success("A época de trocas foi aberta!");
          } else {
            toast.info("A época de trocas foi fechada.");
          }
        }
        
        setTradesOpen(isOpen);
      } catch (err) {
        console.error("Failed to fetch trade period:", err);
        setTradesOpen(false);
      }
    };

    checkTradePeriod();
    const interval = setInterval(checkTradePeriod, 30000);
    return () => clearInterval(interval);
  }, [tradesOpen]); 

  const fetchInitialFeed = useCallback(async () => {
    if (!session?.user?.number) return;
    
    try {
      toggleLoader(true);
      setHasMore(true);
      
      const endpoint = `/api/feed/feed_post/landing/${session.user.number}`;
      const timestamp = new Date().getTime();
      
      //console.log("Fetching initial feed from:", endpoint);
      
      const res = await axios.get(`${endpoint}?t=${timestamp}`);
      
      //console.log("Initial feed response:", res.data);
      
      setDbCursor(res.data.cursor || 1);
      setFeedData(res.data.response || []);
    } catch (error) {
      console.error("Error fetching initial feed:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`Erro ao carregar posts: ${error.response.data.error || 'Erro desconhecido'}`);
      } else {
        toast.error("Erro ao carregar posts.");
      }
      setFeedData([]);
    } finally {
      toggleLoader(false);
    }
  }, [session?.user?.number]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.number) return;
    
    fetchInitialFeed();
  }, [myTrades, session?.user?.number, status, fetchInitialFeed]);

  // Filter posts based on view (personal/all) and UC filter
  useEffect(() => {
    if (!session?.user?.number) {
      setFilteredPosts([]);
      return;
    }

    let posts = feedPosts;
    
    if (myTrades) {
      // Personal view: show user's own trades (all statuses)
      posts = posts.filter((feedPost) => 
        feedPost.from_student?.number === session.user.number ||
        feedPost.to_student?.number === session.user.number
      );
    } else {
      // Public view: show only PENDING trades from others
      posts = posts.filter((feedPost) => 
        feedPost.from_student?.number !== session.user.number &&
        feedPost.status === 'PENDING'
      );
    }
    
    // Filter by selected UCs
    if (ucsFilter.length > 0) {
      posts = posts.filter((feedPost) => {
        const postUCs = feedPost.trade_id
          ?.map((trade) => trade.lessonFrom?.course?.name)
          .filter(Boolean) || [];
        
        // Post must include ALL selected UCs
        return ucsFilter.every((uc) => postUCs.includes(uc));
      });
    }
    
    setFilteredPosts(posts);
  }, [myTrades, ucsFilter, feedPosts, session?.user?.number]);

  // Callback for when a trade is completed (accepted or removed)
  const handleTradeComplete = useCallback(() => {
    console.log("Trade completed, refreshing feed...");
    fetchInitialFeed();
  }, [fetchInitialFeed]);

  // Load more posts
  const getMorePosts = async () => {
    if (!session?.user?.number || !hasMore) return;
    
    toggleLoader(true);
    try {
      const queryFilteredUcs = ucsFilter.length > 0 
        ? encodeURIComponent(ucsFilter.join("&"))
        : "";
      
      const timestamp = new Date().getTime();
      const endpoint = `/api/feed/feed_post/paginated/${dbCursor}/${session.user.number}/${queryFilteredUcs}?t=${timestamp}`;
      
      //console.log("Loading more posts from:", endpoint);
      
      const response = await axios.get(endpoint);
      
      //console.log("Pagination response:", response.data);
      
      if (response.data.response && response.data.response.length > 0) {
        setDbCursor(response.data.cursor || dbCursor);

        const existingIds = new Set(feedPosts.map(p => p.id));
        const newPosts = response.data.response.filter(p => !existingIds.has(p.id));
        
        if (newPosts.length > 0) {
          setFeedData([...feedPosts, ...newPosts]);
        } else {
          setHasMore(false);
          toast.info('Não há mais posts novos.');
        }
      } else {
        setHasMore(false);
        toast.info('Não há mais posts disponíveis.');
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`Erro ao carregar mais posts: ${error.response.data.error || 'Erro desconhecido'}`);
      } else {
        toast.error('Erro ao carregar mais posts.');
      }
    } finally {
      toggleLoader(false);
    }
  };

  // Show loader while authenticating
  if (status === "loading") {
    return (
      <div className="min-h-screen pt-40 flex justify-center items-center bg-white">
        <Loader />
      </div>
    );
  }

  // Require authentication
  if (!session) {
    return (
      <div className="min-h-screen pt-40 flex justify-center items-center bg-white">
        <div className="text-center">
          <p className="text-gray-600">Por favor, faça login para ver o feed.</p>
        </div>
      </div>
    );
  }

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
            {tradesOpen && (
              <div className="flex-grow">
                <NewTradeButton 
                  toggleLoader={toggleLoader}
                  onTradeCreated={handleTradeComplete}
                />
              </div>
            )}
          </div>
        </div>
        {tradesOpen ? (
          <Posts
            filteredPosts={filteredPosts}
            toggleLoader={toggleLoader}
            getMorePosts={getMorePosts}
            hasMore={hasMore}
            onTradeComplete={handleTradeComplete}
            isPersonalView={myTrades}
          />
        ) : tradesOpen === false ? (
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