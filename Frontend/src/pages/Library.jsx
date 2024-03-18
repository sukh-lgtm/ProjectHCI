import React, {useEffect, useState} from 'react';

import { Image } from 'react-bootstrap'

function Library({ selectionMode }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        setSelectedImages([]);
    }, [selectionMode]);

    useEffect(() => {
        async function fetchImages() {
            const imageFiles = import.meta.glob('../images/*.{jpg,jpeg,png,gif}');
            const imagePaths = Object.keys(imageFiles);
            const imageList = await Promise.all(imagePaths.map(async (path) => {
                const imageModule = await imageFiles[path]();
                return { path, src: imageModule.default };
            }));
            setLoading(false);
            setImages(imageList);
        }
        fetchImages();
    }, []);

    const toggleSelectImage = (index) => {
        const isSelected = selectedImages.includes(index);
        if (isSelected) {
            setSelectedImages(selectedImages.filter((i) => i !== index));
        } else {
            setSelectedImages([...selectedImages, index]);
        }
        console.log(selectedImages)
    };


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
                                    onClick={() => selectionMode && toggleSelectImage(index)}
                                    className={selectionMode && selectedImages.includes(index) ? "border-2 border-blue-500 relative overflow-hidden w-full h-full" : "border-0 relative overflow-hidden w-full h-full"}
                                >
                                    <img
                                        src={image.src}
                                        alt={`Image ${index}`}
                                        className="aspect-square w-full h-full object-cover"

                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
        }
        </>
    );

}

export default Library;

// import React, { useEffect, useState } from 'react';
// import { Image } from 'react-bootstrap';
//
// function Library() {
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectionMode, setSelectionMode] = useState(false);
//     const [selectedImages, setSelectedImages] = useState([]);
//
//     useEffect(() => {
//         async function fetchImages() {
//             const imageFiles = import.meta.glob('../images/*.{jpg,jpeg,png,gif}');
//             const imagePaths = Object.keys(imageFiles);
//             const imageList = await Promise.all(imagePaths.map(async (path) => {
//                 const imageModule = await imageFiles[path]();
//                 return { path, src: imageModule.default };
//             }));
//             setLoading(false);
//             setImages(imageList);
//         }
//         fetchImages();
//     }, []);
//
//     const toggleSelectImage = (index) => {
//         const isSelected = selectedImages.includes(index);
//         if (isSelected) {
//             setSelectedImages(selectedImages.filter((i) => i !== index));
//         } else {
//             setSelectedImages([...selectedImages, index]);
//         }
//     };
//
//     const deleteSelectedImages = () => {
//         const remainingImages = images.filter((_, index) => !selectedImages.includes(index));
//         setImages(remainingImages);
//         setSelectedImages([]);
//     };
//
//     const toggleSelectionMode = () => {
//         setSelectionMode(!selectionMode);
//         setSelectedImages([]); // Clear selected images when toggling selection mode
//     };
//
//     return (
//         <>
//             <div className="flex justify-center  mt-24">
//                 <button onClick={toggleSelectionMode}>
//                     {selectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
//                 </button>
//                 {selectionMode && (
//                     <button onClick={deleteSelectedImages}>Delete Selected Images</button>
//                 )}
//             </div>
//             {loading ? (
//                 <div role="status" className="flex flex-row w-screen h-screen justify-center align-middle items-center">
//                     <span className="font-bold ml-4">Loading Images</span>
//                 </div>
//             ) : (
//                 <div className="flex mt-24 flex-grow mx-auto justify-center items-center w-screen">
//                     <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52">
//                         {images.map((image, index) => (
//                             <div key={index} className="image-container">
//                                 {selectionMode && (
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedImages.includes(index)}
//                                         onChange={() => toggleSelectImage(index)}
//                                     />
//                                 )}
//                                 <Image src={image.src} alt={`Image ${index}`} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
//
// export default Library;
