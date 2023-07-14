import React from "react";

interface NavbarLinksProps {
    containerDinamicClass: string,
}

function NavbarLinks(props: NavbarLinksProps) {
    const { containerDinamicClass } = props;
    return (
        <ul className={`text-gray-800 font-semibold sm:flex ${containerDinamicClass}`}>
            <li>
                <a className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/trades">Trocas</a>
            </li>
            <li>
                <a className="hover:bg-gray-100 px-5 py-2 rounded-md inline-block w-full transition duration-300" href="/trades">Calendário</a>
            </li>
        </ul>
    );
}

export default NavbarLinks;