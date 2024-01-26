"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const searchParams = useSearchParams();

  const redirect_url = searchParams.get("redirect");
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const newUrl = new URL(`${redirect_url}&token=${token}&email=${email}`);
  //console.log(newUrl);

  return (
    <main className="flex min-h-screen  items-center justify-between  bg-white">
      <aside className="h-screen border-r dark:border-gray-200 dark:bg-darker focus:outline-none sm:w-1/2 w-full tall:w-full">
        <div className="flex flex-col   min-h-full  justify-center items-center ">
          <div>
            <a href={newUrl.href} className="rounded-md bg-[#018ccb] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Continuar para o perfil
            </a>
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
    </main>
  );
}
