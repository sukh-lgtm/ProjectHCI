import React, {useEffect, useRef, useState} from 'react';

import {Upload} from 'lucide-react'
import Actionbar from "../components/Actionbar.jsx";
import {Image} from "react-bootstrap";
import {useLibrary} from "../context/LibraryProvider.jsx";
import axios from "axios";

function Library({ selectionMode, toggleSelectionMode, searchTags, selectedImages, setSelectedImages, fullPageImage, toggleFullPageMode}) {

    console.log(selectionMode)

    const [showPopup, setShowPopup] = useState(false);
    const [showAlbumNamePopup, setShowAlbumNamePopup] = useState(false);
    const [albumName, setAlbumName] = useState("")
    const [showSellPopup, setSellPopup] = useState(false);

    const { images, loading, fetchImages, setImages } = useLibrary();

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };


    const toggleAlbumNamePopup = () => {
        setShowAlbumNamePopup(!showAlbumNamePopup);
    }

    const toggleSellMenuPopup = () => {
        setSellPopup(!showSellPopup);
    };

    const sellSelectedImages = async () => {
        toggleSellMenuPopup();
    };

    const onCreateAlbumClick = async () => {
        createAlbum(albumName)
    }

    const deleteSelectedImages = async () => {
        togglePopup(); // Show the popup for confirmation
    };

    const createAlbumFromSelectedImages = async () => {
        toggleAlbumNamePopup(); // Show album creation popup for confirmation
    }

    const confirmDelete = async () => {
        const selectedImagePath = selectedImages.map(image => (image.fileName));
        // Make a backend call to delete the selected images
        try {
            const response = await axios.post(
                'http://localhost:3000/delete-images',
                { imageFilenames: selectedImagePath }, // Data object
                { headers: { 'Content-Type': 'application/json' } },
                {proxy: {
                        host: 'localhost',
                        port: 3000
                    }}
            );
            console.log(response.data);
            // If successful, update the state to reflect the changes
            const remainingImages = images.filter((image) => !selectedImages.includes(image));
            setImages(remainingImages);
            setSelectedImages([]);
            togglePopup(); // Hide the popup after deletion
            toggleSelectionMode();
        } catch (error) {
            console.error('Error deleting images:', error);
        }
    };

    async function createAlbum(newAlbumName ) {
        const selectedImagePath = selectedImages.map(image => (image.fileName));
        //make backend call to create new album from selected images
        try {
            const response = await axios.post(
                'http://localhost:3000/create-album',
                { imageFilenames: selectedImagePath, newAlbumName: newAlbumName }, // Data object
                { headers: { 'Content-Type': 'application/json' } } // Specify content type as JSON
            );
            //if successful, return to non "select" mode
            console.log(response.data)
            setSelectedImages([])
            toggleAlbumNamePopup();
            toggleSelectionMode();

        } catch (error) {
            console.error('Error creating album:', error);
        }

    }

    async function handleChange(event) {
        if (event.target.files) {
            await uploadFiles(event.target.files);
        }

    }
    async function uploadFiles(files) {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            console.log(files[i])
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/upload',
                formData// Data object
            );
        } catch (error) {
            console.error('Error uploading images:', error);
        }

        await fetchImages()
    }
    const onUploadButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const inputFile = useRef(null)

    const numberOfImagesSelected = selectedImages.length
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

    function fetchSearchImages(searchTags) {
        let newImageList
        axios.post('http://localhost:3000/getImagesByTags', searchTags).then(r => {
            newImageList = r.data.map((image, index) => ({
                src: image.src,
                fileName: image.id
            }));
            setImages(newImageList)
        })
    }

    useEffect(() => {
        fetchSearchImages(searchTags);
    }, [searchTags]);



    const toggleSelectImage = (image) => {
        console.log("Selected image:", image); // Log the selected image
        console.log("Previously selected images:", selectedImages); // Log the previously selected images array

        const isSelected = selectedImages.includes(image);
        if (isSelected) {
            setSelectedImages(selectedImages.filter((i) => i !== image));
            console.log("Updated selected images after deselection:", selectedImages);
        } else {
            setSelectedImages([...selectedImages, image]);
            console.log("Updated selected images after selection:", selectedImages);
        }
    };

    function getImageUrl(path) {
        return new URL(path, import.meta.url).href
    }

    function closeImage() {
        console.log("Clsed ? ")
        toggleFullPageMode()
        setSelectedImages([])
    }

    function openImage(image) {
        toggleFullPageMode()
        setSelectedImages([image])
        console.log(image)
    }

    return (
        <div className={"min-h-screen"}>
            {images.length === 0 && searchTags.length === 0?
                <div className={"flex justify-center items-center w-screen h-screen flex-col"}>
                    <div>
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_0_1)">
                                <path
                                    d="M50.0003 63.3307C57.3641 63.3307 63.3337 57.3612 63.3337 49.9974C63.3337 42.6336 57.3641 36.6641 50.0003 36.6641C42.6365 36.6641 36.667 42.6336 36.667 49.9974C36.667 57.3612 42.6365 63.3307 50.0003 63.3307Z"
                                    fill="#9C9A9A"/>
                                <path
                                    d="M37.4997 8.33594L29.8747 16.6693H16.6663C12.083 16.6693 8.33301 20.4193 8.33301 25.0026V75.0026C8.33301 79.5859 12.083 83.3359 16.6663 83.3359H83.333C87.9163 83.3359 91.6664 79.5859 91.6664 75.0026V25.0026C91.6664 20.4193 87.9163 16.6693 83.333 16.6693H70.1247L62.4997 8.33594H37.4997ZM49.9997 70.8359C38.4997 70.8359 29.1663 61.5026 29.1663 50.0026C29.1663 38.5026 38.4997 29.1693 49.9997 29.1693C61.4997 29.1693 70.833 38.5026 70.833 50.0026C70.833 61.5026 61.4997 70.8359 49.9997 70.8359Z"
                                    fill="#9C9A9A"/>
                            </g>
                            <line x1="2.13835" y1="14.2292" x2="94.1384" y2="85.2292" stroke="url(#paint0_linear_0_1)"
                                  strokeWidth="7"/>
                            <defs>
                                <linearGradient id="paint0_linear_0_1" x1="49.737" y1="56.5441" x2="55.8809"
                                                y2="49.1346" gradientUnits="userSpaceOnUse">
                                    <stop/>
                                    <stop offset="1" stopColor="#D8D8D8"/>
                                </linearGradient>
                                <clipPath id="clip0_0_1">
                                    <rect width="100" height="100" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <div className={"text-2xl text-neutral-600 font-bold"}>
                        No Pictures Found!
                    </div>

                    <div className={"mt-6 text-neutral-800 flex justify-center content-center items-center"}>
                        Tap <input type="file" id="uploadInput" multiple={true} onChange={handleChange} ref={inputFile}
                                   className={"hidden"}/>
                        <button type="submit"
                                className="mx-2 rounded-[36px] backdrop-blur-[5rem] bg-slate-500 bg-opacity-40 px-2.5 py-1"
                                onClick={onUploadButtonClick}
                        >
                            <div className={"flex flex-row justify-center items-center content-center gap-2"}><Upload
                                width={20} height={20}/> Upload
                            </div>
                        </button>
                        to upload pictures
                    </div>
                </div> :

                images.length===0 && searchTags.length > 0 ?
                    <div className={"flex justify-center items-center w-screen h-screen flex-col"}>
                        <div>

                        </div>

                        <div className={"text-2xl text-neutral-600 font-bold"}>
                            No pictures found with those tags!
                        </div>


                    </div> :

                    loading ?
                        <div role="status"
                             className="flex flex-row w-screen h-screen justify-center align-middle items-center overflow-x-hidden">
                            <svg aria-hidden="true"
                                 className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="font-bold ml-4 text-neutral-700">Loading Images</span>
                        </div> :
                        fullPageImage && selectedImages.length > 0 ?
                            <div>
                                <div
                                    className="flex mx-auto justify-center items-center w-screen h-screen content-center">
                                    <Image
                                        thumbnail src={getImageUrl(selectedImages[0].src)}
                                        alt={selectedImages[0].fileName}
                                        className={`aspect-square object-contain`}
                                    />
                                </div>
                            </div> :
                            <div className="flex mt-28 flex-grow mx-auto justify-center items-center w-screen">
                                <div className="grid grid-cols-3 mx-2 my-2 gap-1 mb-52">
                                    {images.map((image, index) => (

                                        <div key={index}>
                                            <div
                                                onClick={() => selectionMode && toggleSelectImage(image)}
                                                className={selectionMode && selectedImages.includes(image) ? "bg-neutral-800 relative overflow-hidden w-full h-full" : "relative overflow-hidden w-full h-full"}
                                            >
                                                <Image
                                                    thumbnail src={getImageUrl(image.src)}
                                                    alt={image.fileName}
                                                    onClick={() => { !selectionMode ? openImage(image) : null }}
                                                    className={`aspect-square w-full h-full object-cover ${selectionMode ? "cursor-pointer" : "cursor-default"} ${selectedImages.includes(image) ? "opacity-70" : ""}`}
                                                />
                                                {selectionMode && selectedImages.includes(image) ?
                                                    <div className={"absolute z-100 top-1.5 left-1.5"}>
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="10" cy="10" r="9.5" fill="#0500FF" stroke="#E6E0E0" />
                                                            <rect x="4" y="9.71875" width="2" height="6.11681"
                                                                transform="rotate(-45 4 9.71875)" fill="white" />
                                                            <path
                                                                d="M8.50391 14.2422L7.08969 12.828L14.9149 5.00278L16.3291 6.41699L8.50391 14.2422Z"
                                                                fill="white" />
                                                        </svg>

                                                    </div> :
                                                    selectionMode && !selectedImages.includes(image) ?
                                                        <div>
                                                            <div
                                                                className={"absolute top-0 left-0 bg-black blur-md opacity-30 w-full h-[40%] "}>
                                                            </div>
                                                            <div
                                                                className={"absolute top-0 left-0 z-20 stroke-white stroke-2 fill-none ml-2 mt-2"}>
                                                                <svg width="20" height="20" viewBox="0 0 20 20"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="10" cy="10" r="9" />
                                                                </svg>
                                                            </div>
                                                        </div> : <div></div>}

                                            </div>


                                        </div>
                                    ))}
                                </div>
                            </div>
            }
            {selectionMode ? <Actionbar onDelete={deleteSelectedImages} onAlbum={createAlbumFromSelectedImages} onSellClick={sellSelectedImages} selectedImages={selectedImages} /> : null}
            {fullPageImage ? <Actionbar onDelete={deleteSelectedImages} onSellClick={sellSelectedImages} selectedImages={selectedImages} /> : null}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 px-4 min-w-screen">
                    <div className="bg-neutral-50 pt-4 rounded-lg popup-container">
                    <p className="px-4 text-[0.8rem] flex justify-center">Are you sure you want to delete {numberOfImagesSelected} pictures?</p>
                        <p className="px-4 text-[0.8rem]">These images will be stored in <span className={"font-bold whitespace-pre"}> 'Recently Deleted' </span>for 30 days</p>

                        <hr className={"mt-4"}></hr>
                        <div className="w-full grid grid-cols-2 mb-0">
                            <button className="text-[1.2em] text-blue-800 px-2 py-3 border-r-2"
                                    onClick={togglePopup}>
                                Cancel
                            </button>
                            <button className="text-[1.2em] text-red-600 px-2 py-3 rounded-md self-end"
                                    onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showAlbumNamePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 px-4">
                    <div className="bg-neutral-50 pt-4 rounded-lg popup-container">
                        <p className="px-4 text-[1.0rem] flex justify-center">Create New Album</p>

                        <div className="flex flex-row pt-2 text-neutral-300">
                            <form className=" mx-auto w-full">
                                <label htmlFor="default-search" className="mb-2  sr-only">Search</label>
                                <div className="relative w-full flex flex-row px-2">
                                    <input type="search" id="default-search"
                                        className="flex-grow self-center block w-full px-2 py-1 ps-4 text-neutral-900 border border-gray-400 rounded-md bg-gray-200 focus:outline-blue-600 placeholder:self-center"
                                        placeholder="Enter Album Name"
                                        onChange={(e) => setAlbumName(e.target.value)}/>
                                </div>
                            </form>
                        </div>
                        <hr className={"mt-4"}></hr>
                        <div className="w-full grid grid-cols-2 mb-0">
                            <button className="text-[1.2em] text-red-600 px-2 py-3 border-r-2"
                                    onClick={toggleAlbumNamePopup}>
                                Cancel
                            </button>
                            <button className="text-[1.2em] text-blue-800 px-2 py-3 rounded-md self-end"
                                    onClick={onCreateAlbumClick}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    )

}

export default Library;
