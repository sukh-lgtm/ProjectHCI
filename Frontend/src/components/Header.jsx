import React, {useRef, useState} from "react";
import Axios from "axios";
import {useLibrary} from "../context/LibraryProvider.jsx";
import {Check, X, ChevronLeft, SquareCheck, Upload, List, SlidersHorizontal, Search} from 'lucide-react';
import {Link} from "react-router-dom";
import {TagsInput} from "react-tag-input-component";



function Header({ currentPage, selectionMode, toggleSelectionMode, setSearchTags }) {
    const { fetchImages } = useLibrary();

    function handleSearchInput(tags){
        setSearchTags(tags)
    }

    function handleSearchTagRemove(tag){
        setSearchTags(prevItems => {
            return prevItems.filter(item => item !== tag);
        });
    }

    async function handleChange(event) {
        if (event.target.files) {
            await uploadFiles(event.target.files);
        }

    }
    async function uploadFiles(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }


        try {
            const response = await Axios.post(
                'https://project-hci-eosin.vercel.app/upload',
                formData// Data object
            );
        } catch (error) {
            console.error('Error uploading images:', error);
        }

        fetchImages()
    }
    const onUploadButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const inputFile = useRef(null)

    function renderPageHeaderLeft(currentPage) {
        function backToHomePage(){

        }
        switch (currentPage){
            case 'Tag':
                return (<div>
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><ChevronLeft
                                width={20} height={20}/> Back
                            </div>
                        </button>
                    </Link>
                </div>)

            case 'Listings':
                return (<div>
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><ChevronLeft
                                width={20} height={20}/> Back
                            </div>
                        </button>
                    </Link>
                </div>)

            case 'Sell':
                return (<div>
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><ChevronLeft
                                width={20} height={20}/> Back
                            </div>
                        </button>
                    </Link>
                </div>)

            case 'Explore':
                return (<div>
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-slate-400 outline outline-slate-700 bg-opacity-40 px-2.5 py-1">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><SlidersHorizontal
                                width={20} height={20}/> Filter
                            </div>
                        </button>
                    </Link>
                </div>)

            default:
                return (<div>
                    <input type="file" id="uploadInput" multiple={true} onChange={handleChange} ref={inputFile}
                           className={"hidden"}/>
                    <button type="submit"
                            className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1"
                            onClick={onUploadButtonClick}
                    >
                        <div className={"flex flex-row justify-center items-center content-center gap-2"}><Upload
                            width={20} height={20}/> Upload
                        </div>
                    </button>
                </div>)
        }
    }

    function renderPageHeaderRight(currentPage) {
        switch (currentPage) {
            case 'Tag':
                return (
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-green-600 bg-opacity-50 px-2.5 py-1 outline outline-slate-70">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><Check
                                width={20} height={20}/> Done
                            </div>
                        </button>
                    </Link>
                )

            case 'Listings':
                return (
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-green-600 bg-opacity-50 px-2.5 py-1 outline outline-slate-70">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><Check
                                width={20} height={20}/> Done
                            </div>
                        </button>
                    </Link>
                )

            case 'Sell':
                return (
                    <Link to="/library">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-green-600 bg-opacity-50 px-2.5 py-1 outline outline-slate-70">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><Check
                                width={20} height={20}/> Post
                            </div>
                        </button>
                    </Link>
                )
            case 'Explore':
                return (
                    <Link to="/listings">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-50 px-2.5 py-1">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><List
                                width={20} height={20}/> <div>My Listings</div>
                            </div>
                        </button>
                    </Link>
                )
            default:
                return (<div>
                    <button type="button"
                            className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1"
                            onClick={toggleSelectionMode}>
                        {selectionMode ?
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><X
                                width={20} height={20}/> Cancel </div> :
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><SquareCheck
                                width={20} height={20}/> Select </div>}
                    </button>
                </div>)
        }

    }

    return (
        <div>
            <div
                className="fixed top-0 left-0 w-full z-30 p-3 bg-gray-300 bg-opacity-65 backdrop-blur text-neutral-900 border-b border-gray-400">
                <div className="flex flex-row items-center content-center justify-between">
                    {renderPageHeaderLeft(currentPage)}


                    <div className={"text-slate-700 text-xl font-bold"}>
                        {currentPage}
                    </div>

                    {renderPageHeaderRight(currentPage)}


                </div>


                <div className=" flex flex-row text-neutral-300">
                    <form className="mt-2 mx-auto w-full">
                    <label htmlFor="default-search" className="mb-2  sr-only">Search</label>
                        <div className="relative w-full">
                            <TagsInput
                                isEditOnRemove
                                onChange={(tags) => handleSearchInput(tags)}
                                onRemoved={(tag) => handleSearchTagRemove(tag)}
                                name="Enter image tags"
                                placeHolder="Search by tags"
                                classNames={{
                                    input: "flex placeholder:text-[0.85rem] text-slate-700",
                                    tag: "bg-slate-400 text-slate-800",
                                }}
                                style={{ flexGrow: 1 }}
                            />

                            <button type="submit"
                                    className="absolute text-neutral-900 top-[20%] right-2 ">
                                <Search className={"p-0.5 ml-2"}/>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Header;
