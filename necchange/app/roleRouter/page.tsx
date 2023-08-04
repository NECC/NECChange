"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const redirects: any = {
    "SUPER_USER": "/super_user",
    "STUDENT": "/horario",
}


const RoleRouter = () => {
    const router = useRouter()
    const { data: session, status } = useSession() 

    console.log("session", session?.user);

    useEffect(() => {
        if (status === "authenticated" && session.user) {
            router.push(redirects[session.user.role])
        }
    }, [status])

    // dar return a um loader depois
    return <></>
}

export default RoleRouter