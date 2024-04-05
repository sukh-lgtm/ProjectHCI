import React, {useEffect, useState} from 'react';

import Actionbar from '../components/Actionbar';
import Axios from "axios";
import {Image} from "react-bootstrap";

function Account({ selectionMode }) {

    const [selectedImages, setSelectedImages] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showPopup && !event.target.closest(".popup-container") && !event.target.closest(".nav-bar-section")) {
                setShowPopup(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showPopup]);


    useEffect(() => {
        setSelectedImages([]);
    }, [selectionMode]);

    return (
        <>
        <div class="flex pt-15 pt-14 mx-auto justify-center align-middle self-center items-center">
            <div class="relative">
                <img src="images/Default_pfp.png" alt="Blank Profile Picture" class="w-48 h-48 object-cover border-2 border-gray-700 rounded-full mx-auto"/>
            </div>
        </div>
        <div class="w-full max-w-full h-25 pt-8 flex flex-col justify-center align-middle self-center items-center">
            <div class="relative">
                <button type="button" class="text-black focus:text-red-500 bg-gray-400 rounded-[25px] text-1xl px-5 py-2.5">
                    Edit Profile
                </button>
            </div>
        </div>
        <div class="flex flex-row px-4 w-screen pt-10 justify-center align-middle items-center overflow-x-hidden">
            <div class="grid grid-flow-row-dense grid-rows-5 border-4 border-gray-700 bg-gray-400 rounded-2xl">
                <h2 class="font-bold text-2xl place-self-center">User Info</h2>
                <div class="m-5">
                    <div class="grid grid-flow-col-dense grid-cols-3 place-items-start">
                        <div class="relative font-semibold text-1xl">Email</div>
                        <div class="relative font-normal text-1xl col-span-2 pl-4 self-center">JohnDoe@gmail.com</div>
                    </div>
                </div>
                <div class="m-5">
                    <div class="grid grid-flow-col-dense grid-cols-3 place-items-start">
                        <div class="relative font-semibold text-1xl">Name</div>
                        <div class="relative font-normal text-1xl col-span-2 pl-4 self-center">Johnathan Doe</div>
                    </div> 
                </div>
                <div class="m-5">
                    <div class="grid grid-flow-col-dense grid-cols-3 place-items-start">
                        <div class="relative font-semibold text-1xl">Location</div>
                        <div class="relative font-normal text-1xl col-span-2 pl-4 self-center">Calgary, Canada</div>
                    </div>
                </div>
                <div class="m-5">
                    <div class="grid grid-flow-col-dense grid-cols-3 place-items-start">
                        <div class="relative font-semibold text-1xl">Phone Number</div>
                        <div class="relative font-normal text-1xl col-span-2 pl-4 self-center">XXX-XXX-XXXX</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="static w-full max-w-full pt-10 flex flex-col justify-center align-middle self-center items-center">
            <div class="relative">
                <button type="button" class="text-black focus:text-red-600 bg-gray-400 rounded-[36px] text-2xl px-5 py-2.5">
                    <i class="fa fa-sign-out text-black"></i>Log Out
                </button>
            </div>
        </div>
        </>
    );

}

export default Account;
