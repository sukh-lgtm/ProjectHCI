import React, {useEffect, useRef, useState} from "react";
import Axios from "axios";
import {useLibrary} from "../context/LibraryProvider.jsx";
import {Check, X, ChevronLeft, SquareCheck, Upload, List, SlidersHorizontal, Plus, PencilLine, Search} from 'lucide-react';
import {Link} from "react-router-dom";
import {TagsInput} from "react-tag-input-component";



function Header(
    { currentPage, insideAlbumTitle, selectionMode, toggleSelectionMode, setSearchTags, newAlbumButtonClicked, 
    toggleFilterButtonClicked, filterButtonClicked , fullPageImage, toggleFullPageMode, selectedImages, clearInsideAlbumTitle, }) {

    const { fetchImages  } = useLibrary();

    function handleSearchInput(tags){
        setSearchTags(tags)
    }

    function handleSearchTagRemove(tag){
        setSearchTags(prevItems => {
            return prevItems.filter(item => item !== tag);
        });
    }

    function newAlbumButtonAndClearTitle() {
        newAlbumButtonClicked();
        clearInsideAlbumTitle();
    }

    useEffect(() => {
        console.log(filterButtonClicked)
    }, [filterButtonClicked]);

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
                'http://localhost:3000/upload',
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

    const renameAlbum = () => {
        console.log("Rename Album!")
    }

    function renderPageHeaderLeft(currentPage) {
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
                    <Link to="/explore">
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
                return (
                    !filterButtonClicked ?
                        <div onClick={toggleFilterButtonClicked}>
                            <button type="button"
                                    className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-slate-400 outline outline-slate-700 bg-opacity-40 px-2.5 py-1"
                                    >
                                <div className={"flex flex-row justify-center items-center content-center gap-1"}>
                                    <SlidersHorizontal
                                        width={20} height={20}/> Filter
                                </div>
                            </button>
                        </div> :
                        <div onClick={toggleFilterButtonClicked}>
                            <button type="button"
                                    className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-slate-400 outline outline-slate-700 bg-opacity-40 px-2.5 py-1"
                                    >
                                <div className={"flex flex-row justify-center items-center content-center gap-1"}>
                                    <X
                                        width={20} height={20}/> Close
                                </div>
                            </button>
                        </div>
                )

            case 'Albums':
                if(!selectionMode) {
                    return (
                        <div>
                            <Link to={"/libInAlbum?="}>
                                <button type="button"
                                    className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1"
                                    onClick={newAlbumButtonAndClearTitle}
                                >
                                    <div className={"flex flex-row justify-center text-nowrap items-center content-center gap-2"}><Plus
                                        width={20} height={20} /> New
                                    </div>
                                </button>
                            </Link>
                        </div>)
                }
                else {
                    return (<div></div>)
                }
            
            case 'RecentlyDeleted':
                return (<div></div>)

            case 'InsideAlbum':
                return (
                    (selectionMode && selectedImages.length == 0) ?
                        < div >
                            <Link to={`/libInAlbum?=${insideAlbumTitle}`}>
                                <button type="submit"
                                    className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                                    <div className={"flex flex-row justify-center items-center text-nowrap content-center gap-2"}><Plus
                                        width={20} height={20} /> Add
                                    </div>
                                </button>
                            </Link>
                        </div >
                        : !selectionMode ?
                            <div>
                                <Link to="/albums">
                                    <button type="button"
                                        className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                                        <div className={"flex flex-row justify-center items-center content-center gap-1"}><ChevronLeft
                                            width={20} height={20} /> Back
                                        </div>
                                    </button>
                                </Link>
                            </div>

                        : <div></div>
                )

            case 'LibInAlbum':
                return (
                    <div>
                        <Link to={`${insideAlbumTitle.length > 0 ? '/insideAlbum?title=' + insideAlbumTitle : '/albums'}`}
                            onClick={toggleSelectionMode}>
                            <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                                <div className={"flex flex-row justify-center items-center content-center gap-1"}><X
                                    width={20} height={20} /> Cancel
                                </div>
                            </button>
                        </Link>
                    </div>
                )

            case 'Account':
                return(<div></div>)

            case 'Library':
                if(fullPageImage){
                    return (
                        <div>

                            <button type="button"
                                    onClick={toggleFullPageMode}
                                    className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1">
                                <div className={"flex flex-row justify-center items-center content-center gap-1"}>
                                    <ChevronLeft
                                        width={20} height={20}/> Back
                                </div>
                            </button>

                        </div>
                    )
                }
                return (<div>
                    <input type="file" id="newAlbumInput" multiple={true} onChange={handleChange} ref={inputFile}
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


            default:
                return (<div>
                    <input type="file" id="newAlbumInput" multiple={true} onChange={handleChange} ref={inputFile}
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
                    <Link to="/explore">
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
                            <div className={"flex flex-row justify-center items-center content-center gap-1 text-nowrap"}><List
                                width={20} height={20}/> <div>My Listings</div>
                            </div>
                        </button>
                    </Link>
                )

            case 'RecentlyDeleted':
                return (
                    <Link to="/albums">
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-50 px-2.5 py-1">
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><Check
                                width={20} height={20}/> <div>Done</div>
                            </div>
                        </button>
                    </Link>
                )

            case 'InsideAlbum':
                return (<div>
                    <button type="button"
                            className="ml-auto rounded-[36px] backdrop-blur-[5rem] outline outline-slate-700 bg-slate-400 bg-opacity-40 px-2.5 py-1"
                            onClick={toggleSelectionMode}>
                        {selectionMode ?
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><Check
                                width={20} height={20}/> Done </div> :
                            <div className={"flex flex-row justify-center items-center content-center gap-1"}><PencilLine
                                width={20} height={20}/> Edit </div>}
                    </button>
                </div>)
                
            //intentional fallthrough
            case 'Account':
            case 'LibInAlbum':
                return (<div></div>)

            case 'Library':
                if(fullPageImage){
                    return (
                        <div>
                        </div>
                    )
                }
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

    function renderSearchBar(currentPage) {
        switch(currentPage) {

            case 'Albums':
                if(selectionMode){
                    return (<div></div>)
                }
                else {
                    return (<div>
                        <div className="flex flex-row pt-2 text-neutral-300">
                            <form className="mx-auto w-full">
                                <label htmlFor="default-search" className="mb-2  sr-only">Search</label>
                                <div className="relative w-full">
                                    <input type="search" id="default-search"
                                        className="grow self-center w-full py-2 pl-2 text-[0.85rem] rounded-md text-slate-700 border border-slate-400 md:border-none focus: focus:border-blue-400 focus:border-4"
                                        placeholder="Search album names" />
                                    <button type="submit"
                                        className="absolute text-neutral-900 right-2 top-[20%]"
                                        onChange={(e) => setSearchedAlbum(e.target.value)}>
                                        <Search className={"p-0.5 ml-2"} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>)
                }
            
            //intentional fallthrough
            case 'RecentlyDeleted':
            case 'LibInAlbum':
            case 'Account':
                return (<div></div>)

            case 'Library':
                if(fullPageImage){
                    return (
                        <div>
                        </div>
                    )
                }
                else{
                    return (
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
                        </div>)
                }

            default:
                return (
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
                </div>)
        }
    }


    function renderPageTitle(currentPage) {
        switch(currentPage) {
            case "RecentlyDeleted":
                return (<div className="text-center text-xl text-nowrap">Recently Deleted</div>)
            
            case "InsideAlbum":
                return (<div>{insideAlbumTitle}</div>)
            case "LibInAlbum":
                return (<div>Library</div>)
            default:
                return (<div>{currentPage}</div>)
        }
    }

    return (
        <div>
            <div
                className="fixed top-0 left-0 w-full z-50 p-3 bg-gray-300 bg-opacity-65 backdrop-blur text-neutral-900 border-b border-gray-400">
                <div className="grid grid-cols-3 items-center content-center justify-between">
                    <div className="flex col-start-1 justify-self-start">
                        {renderPageHeaderLeft(currentPage)}
                    </div>

                    <div className={"text-slate-700 text-xl font-bold text-no-wrap text-center col-start-2 justify-self-center"}>
                        {renderPageTitle(currentPage)}
                    </div>

                    <div className="flex col-start-3 justify-self-end">
                        {renderPageHeaderRight(currentPage)}
                    </div>


                </div>
                
                <div>
                    {renderSearchBar(currentPage)}
                </div>

            </div>
        </div>
    );
}

export default Header;
