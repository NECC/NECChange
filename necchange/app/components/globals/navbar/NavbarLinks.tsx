import { Session } from "inspector";
import { useSession, signIn, signOut, } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface NavbarLinksProps {
    containerDinamicClass: string,
}

function NavbarLinks(props: NavbarLinksProps) {
    const { containerDinamicClass } = props;
    const {data: session} = useSession();
    return (
        <ul className={`text-gray-800 font-semibold sm:flex ${containerDinamicClass}`}>
            {
                (session) ?
                    <>
                        <li>
                            <Link className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/feed">Feed</Link>
                        </li>
                        
                        <li>
                            <Link className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/horario">Horário</Link>
                        </li>
                    </>
                    :
                    <></>
                
            }
            <li>
                <Link className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/">Calendário</Link>

            </li>
            {    
            (session) ? 
                <li>
                    <button className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300 text-left" onClick={() => signOut()}>Logout</button>
                </li>
                :
                <li>
                  <button
                    className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300"
                    style={{
                      display: 'flex',
                      height: '40px',
                      padding: '8px 20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '100px',
                      background: '#018ccb',
                      color: 'white', // Set text color to match the background
                    }}
                    onClick={() => signIn()}
                  >
                    Login
                  </button>
                </li>
            }
        </ul>
    );
}


export default NavbarLinks;