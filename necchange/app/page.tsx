'use client'
import Image from "next/image";
import {useSession, signIn, signOut} from 'next-auth/react';

export default function Home() {

const {data: session} = useSession();
  if(session){
  return (
    <section className='py-24'>
      <div className='container'>
      <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#018ccb]  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => signOut()}
                    >
                    Sign out
                  </button>
      </div>
    </section>
  )
}
else{
  return (
    <section className='py-24'>
      <div className='container'>
      <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#018ccb]  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => signIn()}
                    >
                    Sign In
                  </button>
      </div>
    </section>
  )
}
}