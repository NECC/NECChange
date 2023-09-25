import React from "react";
import NavbarLinks from "./NavbarLinks";

function MobileNavbarLinks(props) {
    const { isMenuOpened, session } = props;

    return (
        <div className={`${isMenuOpened ? "" : "hidden"} w-full sm:hidden block`}>
            <NavbarLinks containerDinamicClass={`pb-4 flex flex-col align-start`} session={session}/>          
        </div>
    );
}

export default MobileNavbarLinks;