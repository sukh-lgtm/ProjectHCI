import React, {useEffect, useState} from 'react';

import Actionbar from '../components/Actionbar';
import Axios from "axios";
import {Image} from "react-bootstrap";

function Account({ selectionMode }) {

    const [loggedIn, setLoggedIn] = useState(true);
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

    const toggleLogin = () => {
        if(loggedIn) {
            setLoggedIn(false);
        } else {
            setLoggedIn(true);
        }
    }

    return (
        <>
        {
            loggedIn ?
            <div class="flex items-center justify-center max-h-screen bg-gray-300">
                <form action="">
                    <div className="flex pt-20 mx-auto justify-center self-center items-center">
                        <img class="w-36 h-36 object-cover border-2 border-gray-700 bg-gray-700 rounded-full mx-auto" src="/Default_pfp.png" alt="Blank Profile Picture"/>
                    </div>
                    <div className="w-full max-w-full h-25 pt-6 flex flex-col justify-center self-center items-center">
                        <button type="button" className="text-black focus:text-red-500 bg-gray-400 rounded-[25px] text-base px-5 py-2.5">
                            Edit Profile
                        </button>
                    </div>
                    <div className="flex flex-row px-4 w-screen pt-6 justify-center align-middle items-center overflow-x-hidden">
                        <div className="grid grid-flow-row-dense grid-rows-5 border-4 border-gray-700 bg-gray-400 rounded-2xl">
                            <h2 className="font-bold text-2xl place-self-center">User Info</h2>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Email</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">JohnDoe@gmail.com</div>
                                </div>
                            </div>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Name</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">Johnathan Doe</div>
                                </div> 
                            </div>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Location</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">Calgary, Canada</div>
                                </div>
                            </div>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Phone Number</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">XXX-XXX-XXXX</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="static w-full max-w-full pt-6 flex justify-center align-middle self-center items-center">
                        <button type="button" className="text-black focus:text-red-600 bg-gray-400 rounded-[36px] text-base px-5 py-2.5"
                                onClick={toggleLogin}>
                            <i className="fa fa-sign-out text-black"></i>Log Out
                        </button>
                    </div>
                </form>
            </div> :
            <body class="flex items-center justify-center min-h-screen bg-gray-300">
                <div class="main bg-slate-400 rounded-lg p-10 w-screen text-center">
                    <h3 class="text-lg">
                        Login or Sign Up
                    </h3>
                    <form action="">
                        <label for="first" class="block mt-4 mb-2 text-left text-gray-800 font-bold">Username:</label>
                        <input type="text" id="first" name="first"
                            placeholder="Enter your Username"
                            class="block w-full mb-6 px-4 py-2 border 
                            border-gray-300 rounded-md focus:outline-none" required>
                        </input>        
                                
                        <label for="password" class="block mb-2 text-left text-gray-800 font-bold">Password:</label>
                        <input type="password" id="password" name="password"
                            placeholder="Enter your Password"
                            class="block w-full mb-6 px-4 py-2 border 
                            border-gray-300 rounded-md focus:outline-none" required>
                        </input>

                        <div class="flex justify-center items-center">
                            <button type="submit"
                                    class="bg-blue-600 text-white py-3 px-6 rounded
                                -md cursor-pointer">
                                Login
                            </button>
                        </div>

                        <div class="flex justify-center items-center pt-5">
                            <button type="submit"
                                    class="bg-blue-600 text-white py-3 px-6 rounded
                                -md cursor-pointer">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </body>
        }
        </>
    );

}

export default Account;
