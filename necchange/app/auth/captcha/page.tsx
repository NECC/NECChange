"use client";
import Image from "next/image";
import Loader from "@/app/components/globals/Loader";
import { useState, useEffect } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    //const url = `${pathname}?${searchParams}`;
    const redirect = searchParams.get("redirect")
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    const newUrl = new URL(`${redirect}&token=${token}&email=${email}`);
    router.push(newUrl.href)

    window.location.reload();
  }, [pathname, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-between  bg-white">
      {loader && <Loader />}
    </main>
  );
}
