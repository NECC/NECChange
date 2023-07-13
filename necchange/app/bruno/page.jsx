'use client'
import Image from "next/image";
import {useSession, signIn, signOut} from 'next-auth/react';

export default function Home() {
    
  return (
    <main className="flex min-h-screen  items-center justify-between  bg-white">
      <aside className="w-1/2 h-screen border-r dark:border-gray-200 dark:bg-darker focus:outline-none">
        <div className="flex flex-col   min-h-full  justify-center items-center ">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#018ccb]  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => signIn()}
                    >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-col w-1/2  h-screen  justify-center items-center">
        <Image
          src="/logos/neccSticker.png"
          alt="Logo NECC"
          width={400}
          height={400}
        />
        <div className="text-[#018ccb] text-2xl sm:text-6xl font-semibold">
          NECChange
        </div>
      </div>
    </main>
  );
}