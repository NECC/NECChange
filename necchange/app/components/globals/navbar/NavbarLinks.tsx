import Link from "next/link";
import React from "react";

interface NavbarLinksProps {
    containerDinamicClass: string,
}

function NavbarLinks(props: NavbarLinksProps) {
    const { containerDinamicClass } = props;
    return (
        <ul className={`text-gray-800 font-semibold sm:flex ${containerDinamicClass}`}>
            <li>
                <Link className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/feed">Feed</Link>
            </li>
            <li>
                <Link className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/trades">Trocas</Link>
            </li>
            <li>
                <Link className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/calendar">Calendário</Link>
            </li>
        </ul>
    );
}

export default NavbarLinks;