import React, {useEffect, useRef, useState} from 'react';

import axios from "axios";
import {Image} from "react-bootstrap";
import { useLibrary } from '../context/LibraryProvider';
import InsideAlbumActionBar from '../components/InsideAlbumActionBar';

function InsideAlbum ({ selectionMode, albumTitle, fetchInsideAlbumTitle, setSelectionMode }) {

    const [selectedImages, setSelectedImages] = useState([]);
    const [showAlbumNamePopup, setShowAlbumNamePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([])

    const toggleAlbumNamePopup = () => {
        setShowAlbumNamePopup(!showAlbumNamePopup);
    }

    const toggleDeletePopup = () => {
        setShowDeletePopup(!showDeletePopup);
    }

    const removeSelectedImages = () => {
        toggleDeletePopup();
    }

    const fetchAlbum = async () => {
        //make backend call to create new album from selected images
        try {
            const response = await axios.post(
                'http://localhost:3000/fetch-album',
                { albumName: albumTitle }, // Data object
                { headers: { 'Content-Type': 'application/json' } },
                {proxy: {
                        host: 'localhost',
                        port: 3000
                    }}
            );

            const imageList = response.data.images.map(image => ({
                src: image.src,
                fileName: image.fileName
            }));

            //if successful, return to non "select" mode
            setImages(imageList)

        } catch (error) {
            console.error('Error fetching album: ', error);
        }
    }

    const confirmRemoveImages = async () => {

        fetchInsideAlbumTitle()
        const selectedImagePath = selectedImages.map(image => (image.fileName));

        //make backend call to remove selected images from album
        try {
            const response = await axios.post(
                'http://localhost:3000/remove-album-images',
                { albumName: albumTitle, imageFileNames: selectedImagePath }, // Data object
                { headers: { 'Content-Type': 'application/json' } },
                {proxy: {
                        host: 'localhost',
                        port: 3000
                    }}
            );

            // If successful, update the state to reflect the changes
            const remainingImages = images.filter((image) => !selectedImages.includes(image));
            setImages(remainingImages);
            setSelectedImages([]);
            toggleDeletePopup();
            setSelectionMode(false);

        } catch (error) {
            console.error('Error removing images from album:', error);
        }
    }

    const toggleSelectImage = (image) => {
        const isSelected = selectedImages.includes(image);
        if (isSelected) {
            setSelectedImages(selectedImages.filter((i) => i !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };
    const [imagesLength, setImagesLength] = useState(images.length);

    useEffect(() => {
        // Update the imagesLength state whenever the images array changes
        setImagesLength(images.length);
    }, [images]);

    useEffect(() => {
        setSelectedImages([]);
    }, [selectionMode]);

    useEffect(() => {
        setImages([])
        setLoading(true);
        fetchAlbum().then(() => {setLoading(false)});
    }, [albumTitle]);

    useEffect(() => {
        fetchInsideAlbumTitle().then(() => {fetchAlbum()});
    }, []);

    function getImageUrl(path) {
        return new URL(path, import.meta.url).href
    }

    return (
        <div className='min-h-screen'>
            {loading ?
                <div role="status"
                    className="flex flex-row w-screen h-screen justify-center align-middle items-center overflow-x-hidden">
                    <svg aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                    <span className="font-bold ml-4 text-neutral-700">Loading Images</span>
                </div> :
                imagesLength === 0 ?
                    <div className={"flex justify-center items-center w-screen h-screen flex-col"}>
                        <div>
                            <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_0_1)">
                                    <path
                                        d="M50.0003 63.3307C57.3641 63.3307 63.3337 57.3612 63.3337 49.9974C63.3337 42.6336 57.3641 36.6641 50.0003 36.6641C42.6365 36.6641 36.667 42.6336 36.667 49.9974C36.667 57.3612 42.6365 63.3307 50.0003 63.3307Z"
                                        fill="#9C9A9A" />
                                    <path
                                        d="M37.4997 8.33594L29.8747 16.6693H16.6663C12.083 16.6693 8.33301 20.4193 8.33301 25.0026V75.0026C8.33301 79.5859 12.083 83.3359 16.6663 83.3359H83.333C87.9163 83.3359 91.6664 79.5859 91.6664 75.0026V25.0026C91.6664 20.4193 87.9163 16.6693 83.333 16.6693H70.1247L62.4997 8.33594H37.4997ZM49.9997 70.8359C38.4997 70.8359 29.1663 61.5026 29.1663 50.0026C29.1663 38.5026 38.4997 29.1693 49.9997 29.1693C61.4997 29.1693 70.833 38.5026 70.833 50.0026C70.833 61.5026 61.4997 70.8359 49.9997 70.8359Z"
                                        fill="#9C9A9A" />
                                </g>
                                <line x1="2.13835" y1="14.2292" x2="94.1384" y2="85.2292" stroke="url(#paint0_linear_0_1)"
                                    strokeWidth="7" />
                                <defs>
                                    <linearGradient id="paint0_linear_0_1" x1="49.737" y1="56.5441" x2="55.8809"
                                        y2="49.1346" gradientUnits="userSpaceOnUse">
                                        <stop />
                                        <stop offset="1" stopColor="#D8D8D8" />
                                    </linearGradient>
                                    <clipPath id="clip0_0_1">
                                        <rect width="100" height="100" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={"text-2xl text-neutral-600 font-bold"}>
                            No Pictures Found!
                        </div>

                    </div> :
                    <div className="flex mt-16 flex-grow mx-auto justify-center items-center w-screen">
                        <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52">
                            {images.map((image, index) => (

                                <div key={index}>
                                    <div
                                        onClick={() => selectionMode && toggleSelectImage(image)}
                                        className={selectionMode && selectedImages.includes(image) ? "bg-neutral-800 relative overflow-hidden w-full h-full" : "relative overflow-hidden w-full h-full"}
                                    >
                                        <Image
                                            thumbnail src={getImageUrl(image.src)}
                                            alt={image.fileName}
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

            {selectionMode ? <InsideAlbumActionBar onRemove={removeSelectedImages} selectedImages={selectedImages} /> : null}

            {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-75 px-4">
                    <div className="bg-neutral-50 pt-4 rounded-lg popup-container">

                        <p className="px-4 text-[0.9rem] flex justify-center text-center">Are you sure you want to remove {selectedImages.length} pictures from this Album?</p>
                        <p className="px-4 text-center text-[0.9rem]"> The images will not be deleted.</p>

                        <hr className={"mt-4"}></hr>
                        <div className="w-full grid grid-cols-2 mb-0">
                            <button className="text-[1.2em] text-blue-800 px-2 py-3 border-r-2"
                                onClick={toggleDeletePopup}>
                                Cancel
                            </button>
                            <button className="text-[1.2em] text-red-600 px-2 py-3 rounded-md self-end"
                                onClick={confirmRemoveImages}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default InsideAlbum;