import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth"{
    interface Session {
        user: {
            id: string,
            name: string,
            email: string,
            image: string,
            role: string 
        } & DefaultSession
    }

    interface User extends DefaultUser{
        role: string
    }
}