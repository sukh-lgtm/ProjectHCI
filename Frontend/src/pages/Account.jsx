import React, {useEffect, useState} from 'react';

import Actionbar from '../components/Actionbar';
import Axios from "axios";
import {Image} from "react-bootstrap";
import LogoImage from '../../public/ProjectLogo.png'
import {Edit, LogOut, SquareCheck, X} from "lucide-react";

function Account({setVisible}) {

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
            setVisible(false)
            setLoggedIn(false);
        } else {
            setVisible(true)

            setLoggedIn(true);
        }
    }

    return (
        <>
        {
            loggedIn ?
            <div class="flex items-center justify-center min-h-screen bg-gray-300">
                <form action="">
                    <div className="flex mx-auto justify-center self-center items-center">
                        <img class="w-36 h-36 object-cover border-2 border-gray-700 bg-gray-700 rounded-full mx-auto"
                             src="/Default_pfp.png" alt="Blank Profile Picture"/>
                    </div>
                    <div className="w-full max-w-full h-25 pt-6 flex flex-col justify-center self-center items-center">
                        <button type="button"
                                className="rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1"
                        >
                            <div className={"flex flex-row justify-center items-center content-center gap-3 text-lg"}>
                                <Edit
                                    width={25} height={25}/> Edit Profile
                            </div>
                        </button>
                    </div>
                    <div
                        className="flex flex-row px-4 w-screen pt-6 justify-center align-middle items-center overflow-x-hidden">
                        <div
                            className="grid grid-flow-row-dense grid-rows-5 border border-slate-500 bg-slate-300 rounded-2xl">
                            <h2 className="font-bold text-2xl place-self-center">User Info</h2>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Email</div>
                                    <div
                                        className="font-normal text-base col-span-2 pl-4 self-center">JohnDoe@gmail.com
                                    </div>
                                </div>
                            </div>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Name</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">Johnathan Doe
                                    </div>
                                </div>
                            </div>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Location</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">Calgary, Canada
                                    </div>
                                </div>
                            </div>
                            <div className="ml-5 my-1">
                                <div className="grid grid-flow-col-dense grid-cols-3 place-items-start">
                                    <div className="font-semibold text-base">Phone Number</div>
                                    <div className="font-normal text-base col-span-2 pl-4 self-center">XXX-XXX-XXXX
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button"
                            className="rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-opacity-40 px-2.5 py-1 flex ml-auto mr-4 mt-4"
                    >
                        <div className={"flex flex-row justify-center items-center content-center gap-3 text-lg text-red-600"}
                             onClick={toggleLogin}>
                            <LogOut
                                width={25} height={25}/> Log Out
                        </div>
                    </button>
                </form>
            </div> :
                <body className="flex items-center flex-col justify-center min-h-screen  mx-4">
                <Image src={LogoImage} width={130} className={"rounded-[2rem]"}/>
                <div className={"font-medium text-2xl "}>
                    Picamy
                </div>
                <div className="flex flex-col main rounded-lg p-10 w-full text-center outline outline-slate-400 mt-6">
                    <h3 className="text-3xl self-start">
                        Login or Sign Up
                    </h3>
                    <form action="">
                        <label for="first" class="block mt-4 mb-1 text-left text-gray-800 font-bold">Username:</label>
                        <input type="text" id="first" name="first"
                            placeholder="Enter your Username"
                            class="block w-full mb-6 px-4 py-2 border 
                            border-gray-300 rounded-md focus:outline-none" required>
                        </input>        
                                
                        <label for="password" class="block mb-1 text-left text-gray-800 font-bold">Password:</label>
                        <input type="password" id="password" name="password"
                            placeholder="Enter your Password"
                            class="block w-full mb-6 px-4 py-2 border 
                            border-gray-300 rounded-md focus:outline-none" required>
                        </input>

                        <div class="flex flex-col mx-14 justify-center items-center gap-3">
                            <button type="submit"
                                    class="bg-blue-600 text-white py-3 px-6 rounded-xl cursor-pointer w-full">
                                Login
                            </button>

                            <button type="submit"
                                    class="bg-blue-600 text-white py-3 px-6 rounded-xl cursor-pointer w-full">
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
