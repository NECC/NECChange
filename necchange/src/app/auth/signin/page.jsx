"use client";
import Image from "next/image";
import Loader from "@/app/components/globals/Loader";
import { signIn } from "next-auth/react";
import { useState } from "react";

import axios from "axios";

export default function Home() {
  const [inputEmail, setInputEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const toggleLoader = (value) => {
    setLoader(value);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      toggleLoader(true);
      const result = await email_validator();
      if (result == true) {
        setErrorMessage(false);
        await signIn("email", { email: inputEmail, callbackUrl: "/horario" });
      } else {
        setErrorMessage(true);
        console.log("Invalid email");
      }
      toggleLoader(false);
    } catch (error) {
      toggleLoader(false);
      console.log("Unable to sign-in: ", error);
    }
  };

  const email_validator = async () => {
    // if (inputEmail == "dev@necc.di.uminho.pt") return true;
    // else {
    const result = await axios
      .get(`/api/user_exists/${inputEmail}`)
      .then((res) => {
        if (res.data.response == "success") return true;
        else return false;
      });
    return result;
    //}
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
                <div>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email Institucional"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => setInputEmail(e.target.value)}
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-red-600">Email inválido!</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#018ccb]  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={(e) => {
                      handleSignin(e);
                    }}
                  >
                    Sign in
                  </button>
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
