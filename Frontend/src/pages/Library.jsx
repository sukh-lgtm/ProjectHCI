import React, {useEffect, useState} from 'react';

import Actionbar from "../components/Actionbar.jsx";
import Axios from "axios";
import {Image} from "react-bootstrap";

function Library({ selectionMode }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const deleteSelectedImages = async () => {
        togglePopup(); // Show the popup for confirmation
    };

    const confirmDelete = async () => {
        const selectedImagePath = selectedImages.map(image => (image.fileName));
        // Make a backend call to delete the selected images
        try {
            const response = await Axios.post(
                'http://localhost:3000/delete-images',
                { imageFilenames: selectedImagePath }, // Data object
                { headers: { 'Content-Type': 'application/json' } } // Specify content type as JSON
            );
            console.log(response.data);
            // If successful, update the state to reflect the changes
            const remainingImages = images.filter((image) => !selectedImages.includes(image));
            setImages(remainingImages);
            setSelectedImages([]);
            togglePopup(); // Hide the popup after deletion
        } catch (error) {
            console.error('Error deleting images:', error);
        }
    };




    // const deleteSelectedImages = async () => {
    //     const selectedImagePath = selectedImages.map(image => (image.fileName));
    //
    //     // Make a backend call to move the selected images
    //     try {
    //         const response = await Axios.post(
    //             'http://localhost:3000/delete-images',
    //             { imageFilenames: selectedImagePath }, // Data object
    //             { headers: { 'Content-Type': 'application/json' } } // Specify content type as JSON
    //         );
    //         console.log(response.data);
    //         // If successful, update the state to reflect the changes
    //         const remainingImages = images.filter((image) => !selectedImages.includes(image));
    //         setImages(remainingImages);
    //         setSelectedImages([]);
    //     } catch (error) {
    //         console.error('Error moving images:', error);
    //     }
    // };


    useEffect(() => {
        setSelectedImages([]);
    }, [selectionMode]);

    // useEffect( () => {
    //     async function fetchImages() {
    //         setImages([])
    //         const imageFiles = import.meta.glob('../../../Backend/library_images/*.{jpg,jpeg,png,gif}');
    //         const imagePaths = Object.keys(imageFiles);
    //         console.log(imagePaths)
    //         const imageList = await Promise.all(imagePaths.map(async (path) => {
    //             const imageModule = await imageFiles[path]();
    //             const fileName = path.split('/').pop();
    //             return {path, src: imageModule.default, fileName};
    //         }));
    //
    //         setLoading(false);
    //         setImages(imageList);
    //         console.log(imageList)
    //     }
    //     fetchImages();
    // }, []);

    useEffect(() => {
        async function fetchImages() {
            setLoading(true)
            try {
                const response = await Axios.get('http://localhost:3000/fetch-images'); // Replace 'your_endpoint_url_here' with your actual endpoint URL
                const imageList = response.data.images.map((image, index) => ({
                    src: image.src,
                    fileName: image.id
                }));
                setImages(imageList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                setLoading(false);
            }
        }
        fetchImages();
    }, []);


    const toggleSelectImage = (image) => {
        const isSelected = selectedImages.includes(image);
        if (isSelected) {
            setSelectedImages(selectedImages.filter((i) => i !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };

    function getImageUrl(path) {
        return new URL(path, import.meta.url).href
    }

    return (
        <>
        {
            loading ?
                <div role="status" className="flex flex-row w-screen h-screen justify-center align-middle items-center">
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
                    <span className="font-bold ml-4">Loading Images</span>
                </div> :
                <div className="flex mt-24 flex-grow mx-auto justify-center items-center w-screen">
                    <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52">
                        {images.map((image, index) => (

                            <div key={index}>
                                <div
                                    onClick={() => selectionMode && toggleSelectImage(image)}
                                    className={selectionMode && selectedImages.includes(image) ? "border-blue-500 border-4 relative overflow-hidden w-full h-full p-6 transition ease-in-out" : "border-2 border-gray-300 relative overflow-hidden w-full h-full"}
                                >
                                    <Image
                                        thumbnail src={getImageUrl(image.src)}
                                        alt={image.fileName}
                                        className={`aspect-square w-full h-full object-cover  ${selectionMode ? "cursor-pointer" : "cursor-default"}`}
                                    />
                                    {selectionMode && selectedImages.includes(image) ?
                                        <div className={"absolute z-100 top-1.5 left-1.5 fill-blue-600"}>
                                            <svg width="20" height="20" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M14.5 5.5L8 12.17L4.41 8.59L3 10L8 15L16 7L14.5 5.5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18Z"
                                                    />
                                            </svg>
                                        </div> :
                                        selectionMode && !selectedImages.includes(image)?
                                            <div className={"absolute z-100 top-1.5 left-1.5 stroke-gray-300 stroke-2 fill-none"}>
                                                <svg width="20" height="20" viewBox="0 0 20 20"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10" r="9"/>
                                                </svg>
                                            </div> : <div></div>}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
        }
            {selectionMode ? <Actionbar onDelete={deleteSelectedImages} />: null}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-55">
                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-[0.75rem] flex justify-center">Are you sure you want to delete?</p>
                        <p className="text-[0.75rem] flex justify-center">These images will be stored in <span className={"font-bold whitespace-pre"}> 'Recently Deleted' </span> for 30 days</p>
                        <div className="flex w-full justify-around mt-4">
                            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                    onClick={togglePopup}>
                                Cancel
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md self-end"
                                    onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

export default Library;
