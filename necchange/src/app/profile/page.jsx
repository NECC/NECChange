"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react";
import QRCode from 'easyqrcodejs';
import colors from "tailwindcss/colors";
import Loader from "@/components/globals/Loader";

export default function Perfil() {
    const { data: session, status } = useSession()

    if (status !== "authenticated") return <Loader />
    console.log(session);

    
    return (
        <section className="min-h-screen grow flex flex-col justify-center items-center bg-zinc-50">
            <article className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center px-12">
                <VirtualCard name={session.user.name} partnerNumber={session.user.partnerNumber} studentNumber={session.user.number.toUpperCase()}/>
                <Code data={session.user.id} />
            </article>
        </section>
    )
}

const VirtualCard = ({ name, partnerNumber, studentNumber }) => {
    return (
        <article className="bg-gradient-to-br from-blue-400 via-indigo-500 to-indigo-500 text-white text-lg shadow-lg rounded-2xl px-6 py-4 h-48 w-80 sm:h-56 sm:w-96">
            <div className="h-full">
                <div className="flex flex-row w-full justify-between">
                    <div className="w-1/3">
                        <p className="font-bold text-2xl">NECC</p>
                    </div>
                    <div className="w-auto">
                        <p className="font-semibold md:text-base text-sm">Sócio Nr: {partnerNumber}</p>
                    </div>
                </div>
                <div className="flex flex-col pb-6 h-full justify-end md:text-lg text-sm">
                    <p>{studentNumber}</p>
                    <p >{name}</p>
                </div>
            </div>
        </article>
    );
}

const Code = ({ data }) => {
    const qrcode = useRef(null)

    useEffect(() => {
        // Options
        var options = {
            text: data,
            width: 200,
            height: 200,
            colorDark: colors.white,
            colorLight: colors.slate[900],
            correctLevel: QRCode.CorrectLevel.H
        }

        const code = new QRCode(qrcode.current, options);

        return () => code.clear()
    }, [qrcode])

    return (
        <div className="border-blue-500 border-4 p-4 rounded-xl bg-white" ref={qrcode}></div>
    )
}