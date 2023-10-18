import { signIn, signOut, } from "next-auth/react";
import Link from "next/link";
import React from "react";


function NavbarLinks(props) {
    const { containerDinamicClass, session } = props;
    const linkStyle = "hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300"
    return (
        <ul className={`text-gray-800 font-semibold sm:flex ${containerDinamicClass}`}>
            <li>
                <Link className={linkStyle} href="/">Calendário</Link>

            </li>
            {
                /*
                (session) ?
                    <>
                        <li>
                            <Link className={linkStyle} href="/horario">Horário</Link>
                        </li>
                        <li>
                            <Link className={linkStyle} href="/feed">Feed</Link>
                        </li>
                        <li>
                            <button className={linkStyle + " text-left"} onClick={() => signOut()}>Logout</button>
                        </li>
                    </>
                    :
                    <>
                        <li>
                            <button className={linkStyle + " text-left"} onClick={() => signIn()}>Login</button>
                        </li>
                    </>
                    */
                
                (session) ? 
                    <>
                        <li>
                            <Link className={linkStyle} href="/profile">Perfil</Link>
                        </li>
                        <li>
                            <button className={linkStyle + " text-left"} onClick={() => signOut()}>Logout</button>
                        </li>
                    </>
                    :
                    <>
                        <li>
                            <button className={linkStyle + " text-left"} onClick={() => signIn()}>Login</button>
                        </li>
                    </>
            }
            {
            (session?.user.role == 'SUPER_USER') 
                ? 
                <li>
                   <Link className={linkStyle + " text-left"} href='/super_user'>Back-Office</Link> 
                </li>
                :
                <></>
            }
        </ul>
    );
}


export default NavbarLinks;