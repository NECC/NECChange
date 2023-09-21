"use client";
import Image from "next/image";
import Loader from "@/app/components/globals/Loader";
import { useState, useEffect } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [inputEmail, setInputEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log(url);
    const newUrl = new URL(
      `${searchParams.get("redirect")}&token${searchParams.get(
        "token"
      )}&email=${searchParams.get("email")}`
    );
    setRedirect(newUrl.href);
    console.log("searchParams", newUrl.href);
  }, [pathname, searchParams]);

  const toggleLoader = (value: boolean) => {
    setLoader(value);
  };

  return (
    <main className="flex min-h-screen  items-center justify-between  bg-white">
      <aside className="h-screen border-r dark:border-gray-200 dark:bg-darker focus:outline-none sm:w-1/2 w-full tall:w-full">
        <div className="flex flex-col   min-h-full  justify-center items-center ">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Entra na tua conta
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-2" action="#" method="POST">
                <div className="">
                  <label htmlFor="email" className="sr-only">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      className="h-4 w-4 text-[#018ccb] focus:ring-[#018ccb] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-2xl text-gray-900">
                      Não sou um robô
                    </span>
                  </label>
                </div>

                <div>
                  <Link href={redirect}>Entrar</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-col w-1/2  h-screen  justify-center items-center hidden sm:flex tall:hidden">
        <Image
          src="/logos/neccSticker.png"
          alt="Logo NECC"
          width={400}
          height={400}
        />
        <div className="text-[#018ccb]  sm:text-5xl font-semibold">
          NECChange
        </div>
      </div>
      {loader && <Loader />}
    </main>
  );
}
