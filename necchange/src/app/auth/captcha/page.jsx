"use client";
import Loader from "@/components/globals/Loader";

import {redirect } from "next/navigation";
import {useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();

  const redirect_url = searchParams.get("redirect");
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const newUrl = new URL(`${redirect_url}&token=${token}&email=${email}`);
  redirect(newUrl.href)

  return (
    <main className="flex min-h-screen items-center justify-between  bg-white">
      {newUrl}
      <Loader />
    </main>
  );
}