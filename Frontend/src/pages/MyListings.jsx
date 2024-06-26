import {useLocation} from "react-router-dom";
import {Image} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { TagsInput } from "react-tag-input-component";
import '../tags.css'
import {useLibrary} from "../context/LibraryProvider.jsx";
import {Check, Edit2, Trash2, Upload, X} from "lucide-react";


function MyListings() {
    const [imageInfo, setImageInfo] = useState({});
    const location = useLocation()
    const [imagesSource, setImagesSource] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const [deleteFileName,setDeleteFileName]  = useState("")
    const [deleteIndex,setDeleteIndex]  = useState(-1)
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };


    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }

    useEffect(() => {
        // Call the function to set image tag info when the component is mounted
        setImageListing().then(() => {console.log(imagesSource)});
    }, []);

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
        } catch (error) {
            console.error('Error deleting images:', error);
        }
    };


    async function setImageListing() {
        const currImageListings = (await axios.get('http://localhost:3000/getListings')).data
        const imageList = []
        for (const image in currImageListings) {
            imageList.push(image)
        }
        console.log(imageList)
        const imagesSourceUrls = (await axios.post('http://localhost:3000/getImageUrls', {imageList})).data

        console.log("Urls: ", imagesSourceUrls)

        const imageListDetails = imagesSourceUrls.map((image, index) => ({
            src: image.src,
            fileName: image.id,
            edit: false
        }));

        setImagesSource(imageListDetails)

        await setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap };

            for (const image in currImageListings) {
                if(imageList.includes(image)){
                    updatedHashmap[image] = currImageListings[image];
                }
            }
            return updatedHashmap;
        });

    }

    useEffect(() => {
        console.log("Hello there")
        addImageSellInfo()
    }, [imageInfo]);

    function addImageSellInfo() {
        console.log(imageInfo)
        axios.post('http://localhost:3000/updateSellInfo', imageInfo).then(r => console.log(r.data))
    }

    function handleNameChange(imageName, value) {
        setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap
            updatedHashmap[imageName].Name = value;
            return updatedHashmap; // Return the updated hashmap
        });
    }

    function handlePriceChange(imageName, value) {
        setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap
            updatedHashmap[imageName].Price = value;
            return updatedHashmap; // Return the updated hashmap
        });
    }



    function handleLocationChange(imageName, value) {
        setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap
            updatedHashmap[imageName].Location = value;
            return updatedHashmap; // Return the updated hashmap
        });
    }

    function handleTagsChange(imageName, value) {
        console.log("Called")
        setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap
            updatedHashmap[imageName].Tags = value;
            return updatedHashmap; // Return the updated hashmap
        });
    }

    function handleDeleteTag(image, tag) {
        const obj = {"images" : [image], "tag": tag}
        axios.post('http://localhost:3000/deleteTag', obj).then()
    }

    function handleEditListing(index) {
        const imageList = [...imagesSource];
        imageList[index].edit = !imageList[index].edit
        setImagesSource(imageList);
    }

    function handleDeleteListing() {
        const obj = {"image" : deleteFileName}

        const imageList = [...imagesSource];
        const updatedItems = imageList.filter((list, i) => i !== deleteIndex);
        setImagesSource(updatedItems);

        const updatedImageInfo = { ...imageInfo };
        delete updatedImageInfo[deleteFileName];
        setImageInfo(updatedImageInfo);

        axios.post('http://localhost:3000/deleteListing', obj).then(() => {
            setImageListing().then()
        })
        setDeleteFileName("")
        setDeleteIndex(-1)
        togglePopup()

    }

    function handlePopUpDelete(fileName, index) {
        setDeleteFileName(fileName)
        setDeleteIndex(index)
        togglePopup()
    }

    return (
        <div className={"min-h-screen mb-28 flex flex-col"}>
            <div className={"w-full"}>

                <div className={"flex gap-3 flex-col"}>
                    {imagesSource.length > 0 ?
                        <div className={"mt-[7.5rem]"}>

                            {imagesSource.map((image, index) => (
                            <div
                                className={"flex mb-6 flex-col border border-neutral-500 bg-slate-200 p-2 rounded-lg mx-2 max-w-full justify-center items-center text-slate-800 shadow-xl"}>
                                <div key={index}
                                     className={"flex flex-col w-full justify-center items-center content-center text-slate-800 gap-3"}>
                                    <div className={"flex self-start text-xl text-slate-700 font-bold"}>
                                        {imageInfo[image.fileName].Name}
                                    </div>
                                    <div className={"w-full h-full flex justify-center content-center"}>
                                        <Image
                                            thumbnail
                                            src={getImageUrl(image.src)}
                                            alt={image.fileName}
                                            className={`aspect-square  object-cover outline outline-neutral-500 rounded-xl w-[75%]`}
                                        />
                                    </div>
                                    <div className={`w-full grid grid-cols-3 gap-2 ${image.edit ? "" : "px-10"}`}>

                                        <div className={"font-bold w-full"}>
                                            Name:
                                        </div>

                                        <div className={"col-span-2"}>
                                            {
                                                image.edit ?
                                                    <div className={"w-full flex"}>
                                                        <input
                                                            required={true}
                                                            value={imageInfo[image.fileName].Name}
                                                            onChange={(e) => handleNameChange(image.fileName, e.target.value)}
                                                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50 invalid:border-red-500"}
                                                            placeholder={"Enter Image Name"}
                                                        />
                                                    </div> :
                                                    <div>
                                                        {imageInfo[image.fileName].Name}
                                                    </div>
                                            }

                                        </div>


                                        <div className={"font-bold"}>
                                            Price:
                                        </div>

                                        <div className={"col-span-2"}>
                                            {
                                                image.edit ?
                                                    <div className={"relative w-full col-span-2"}>
                                                        {/*{imageInfo[image.fileName] ? <input*/}
                                                        {/*    value={imageInfo[image.fileName].Date}*/}
                                                        {/*    type="date"*/}
                                                        {/*    onChange={(e) => handleDateChange(image.fileName, e.target.value)}*/}
                                                        {/*    className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50"}*/}
                                                        {/*/> : <>Loading...</>}*/}
                                                        <span
                                                            className={"absolute top-1 left-1 font-bold border-r border-slate-400 px-2"}>
                                                                $
                                                            </span>
                                                        <input
                                                            required={true}
                                                            value={imageInfo[image.fileName].Price}
                                                            type="number"
                                                            onChange={(e) => handlePriceChange(image.fileName, e.target.value)}
                                                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50 pl-10 invalid:border-red-500"}
                                                            placeholder={"Enter Image Price"}
                                                        />
                                                    </div> :
                                                    <div className={"w-full"}>
                                                        ${imageInfo[image.fileName].Price}
                                                    </div>
                                            }
                                        </div>

                                        <div className={"font-bold"}>
                                            Location:
                                        </div>

                                        <div className={"col-span-2"}>
                                            {
                                                image.edit ?
                                                    <div className={"w-full flex"}>
                                                        <input
                                                            required={true}
                                                            value={imageInfo[image.fileName].Location}
                                                            onChange={(e) => handleLocationChange(image.fileName, e.target.value)}
                                                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50"}
                                                            placeholder={"Enter Image Name"}
                                                        />
                                                    </div> :
                                                    <div>
                                                        {imageInfo[image.fileName].Location}
                                                    </div>
                                            }
                                        </div>


                                        {/*<div className={"mt-3 w-full"}>*/}

                                        <div className={"font-bold"}>
                                            Tags:
                                        </div>

                                        <div className={"col-span-2"}>
                                            {image.edit ?
                                                <TagsInput
                                                    onRemoved={(tag) => handleDeleteTag(image.fileName, tag)}
                                                    value={imageInfo[image.fileName].Tags}
                                                    isEditOnRemove
                                                    onChange={(tags) => handleTagsChange(image.fileName, tags)}
                                                    name="Enter image tags"
                                                    placeHolder="Hit enter to add tags"
                                                    classNames={{
                                                        input: "flex placeholder:text-[0.85rem] bg-slate-50 w-full",
                                                        tag: "bg-slate-300"
                                                    }}

                                                /> :

                                                <div className={"flex flex-wrap gap-1"}>
                                                    {imageInfo[image.fileName].Tags.length > 0 ?
                                                        imageInfo[image.fileName].Tags.map((tag, index) => (
                                                            <div
                                                                className={"px-2 py-1 bg-slate-300 rounded-lg"}> {tag} </div>
                                                        )) : <div className={"font-bold"}>
                                                            -
                                                        </div>}
                                                </div>
                                            }
                                        </div>
                                    </div>


                                </div>


                                <hr className={"my-4 w-full  border-2 border-slate-400 rounded-full"}/>
                                <div className={"flex flex-col w-full self-start px-2"}>
                                    <div className={"flex text-lg font-bold underline text-green-800"}>
                                        Listing Stats:
                                    </div>

                                    <div className={"w-full flex justify-between text-slate-700"}>
                                        <div className={"flex gap-2"}>
                                            <div className={"font-bold"}>
                                                Sales:
                                            </div>
                                            <div className={"text-green-700"}>
                                                {imageInfo[image.fileName].Sales}
                                            </div>
                                        </div>

                                        <div className={"flex gap-2"}>
                                            <div className={"font-bold"}>
                                                Revenue generated:
                                            </div>
                                            <div className={"text-green-700"}>
                                                ${imageInfo[image.fileName].Price * imageInfo[image.fileName].Sales}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <hr className={"my-4 w-full  border-2 border-slate-400 rounded-full"}/>

                                <div className={"flex justify-between w-full"}>
                                    <div>
                                        <button type="button"
                                                className={`p-2 rounded-lg`}
                                                onClick={() => handlePopUpDelete(image.fileName, index)}
                                        >
                                            {
                                                <div
                                                    className={"flex flex-row justify-center items-center content-center gap-1 text-red-600"}>
                                                    <Trash2
                                                        width={20} height={20}/> Delete Listing
                                                </div>
                                            }
                                        </button>
                                    </div>
                                    <div>
                                        <button type="button"
                                                className={` p-2 rounded-lg`}
                                                onClick={() => handleEditListing(index)}
                                        >
                                            {!image.edit ?
                                                <div
                                                    className={"flex flex-row justify-center items-center content-center gap-1 text-blue-800"}>
                                                    <Edit2
                                                        width={20} height={20}/> Edit Listing
                                                </div> :
                                                <div className={"flex gap-2"}>
                                                    <div
                                                        className={"px-2 outline rounded-md flex justify-center items-center content-center gap-1 text-blue-800"}>
                                                        <X
                                                            width={20} height={20}/> Cancel
                                                    </div>
                                                    <div
                                                        className={"px-2 outline rounded-md flex flex justify-center items-center content-center gap-1 text-green-700"}>
                                                        <Check
                                                            width={20} height={20}/> Done
                                                    </div>
                                                </div>

                                            }
                                        </button>
                                    </div>

                                    {showPopup && (
                                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10 px-4 min-w-screen">
                                            <div className="bg-neutral-50 pt-4 rounded-lg popup-container">
                                                <p className="px-4 text-[0.8rem] flex justify-center">Are you sure you want to delete this listing?</p>
                                                <hr className={"mt-4"}></hr>
                                                <div className="w-full grid grid-cols-2 mb-0">
                                                    <button className="text-[1.2em] text-blue-800 px-2 py-3 border-r-2"
                                                            onClick={togglePopup}>
                                                        Cancel
                                                    </button>
                                                    <button className="text-[1.2em] text-red-600 px-2 py-3 rounded-md self-end"
                                                            onClick={() => handleDeleteListing()}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>:
                        <div className={"flex justify-center min-h-screen text-center content-center items-center w-screen flex-col"}>

                            <div className={"text-2xl text-neutral-600 font-bold"}>
                                You haven't posted any pictures for sale!
                            </div>

                            {/*<div className={"mt-6 text-neutral-800 flex justify-center content-center items-center"}>*/}
                            {/*    Tap <input type="file" id="uploadInput" multiple={true} onChange={handleChange}*/}
                            {/*               ref={inputFile}*/}
                            {/*               className={"hidden"}/>*/}
                            {/*    <button type="submit"*/}
                            {/*            className="mx-2 rounded-[36px] backdrop-blur-[5rem] bg-slate-500 bg-opacity-40 px-2.5 py-1"*/}
                            {/*            onClick={onUploadButtonClick}*/}
                            {/*    >*/}
                            {/*        <div className={"flex flex-row justify-center items-center content-center gap-2"}>*/}
                            {/*            <Upload*/}
                            {/*                width={20} height={20}/> Upload*/}
                            {/*        </div>*/}
                            {/*    </button>*/}
                            {/*    to upload pictures*/}
                            {/*</div>*/}
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}

export default MyListings;
