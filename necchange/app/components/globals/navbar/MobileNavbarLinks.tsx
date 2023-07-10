import React from "react";
import NavbarLinks from "./NavbarLinks";

interface MobileNavbarLinksProps {
    isMenuOpened: boolean,
}

function MobileNavbarLinks(props: MobileNavbarLinksProps) {
    const { isMenuOpened } = props;

    return (
        <div className={`${isMenuOpened ? "" : "hidden"} w-full sm:hidden block`}>
            <NavbarLinks containerDinamicClass={`pb-4 flex flex-col align-start`}/>          
        </div>
    );
}

export default MobileNavbarLinks;