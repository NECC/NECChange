import React from "react";
import NavbarLinks from "./NavbarLinks";

function MobileNavbarLinks({isMenuOpened}) {
    return (
        <div className={`${isMenuOpened ? "" : "hidden"} w-full sm:hidden block`}>
            <NavbarLinks containerDinamicClass={`pb-4 flex flex-col align-start`}/>          
        </div>
    );
}

export default MobileNavbarLinks;