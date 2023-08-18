"use client"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function SuperUser() {
    const { data: session, status } = useSession();
    console.log(session);

    /* useEffect(() => {
        if (session && session.user?.role !== 'SUPER_USER') {
            redirect('/')
        }

    }, [status]) */

    const buttonStyles = "p-6 m-2 text-xl border-2 border-sky-500 shadow-md rounded-md bg-white hover:bg-slate-50"

    return (
        <div className="flex justify-center h-screen bg-white text-black">
            <div className="grid grid-cols-3 m-auto">
                <Link className={buttonStyles} href='/super_user/users'>Manage Users</Link>
                <Link className={buttonStyles} href='/'>Manage Posts</Link>
                <Link className={buttonStyles} href='/'>Manage Trades</Link>
            </div>
        </div>
    )
}