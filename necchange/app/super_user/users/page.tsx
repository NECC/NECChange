"use client"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ManageUsers(){
    const { data: session, status } = useSession();

    return(
        <div className="bg-white h-screen">
            <div className="">

            </div>
        </div>
    )
}