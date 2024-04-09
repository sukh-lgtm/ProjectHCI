import {useLocation} from "react-router-dom";
import {Image} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { TagsInput } from "react-tag-input-component";
import '../tags.css'


function SellPage() {
    const [imageInfo, setImageInfo] = useState({});
    const location = useLocation()
    const selectedImages = location.state?.selectedImages

    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }

    useEffect(() => {
        // Call the function to set image tag info when the component is mounted
        setImageSellInfo().then();
    }, [selectedImages]);

    useEffect(() => {
        console.log("Hello there")
        addImageSellInfo()
    }, [imageInfo]);

    function addImageSellInfo() {
        console.log(imageInfo)
        axios.post('http://localhost:3000/updateSellInfo', imageInfo).then(r => console.log(r.data))
    }

    async function setImageSellInfo() {
        const obj = {"images": selectedImagesFilenames}
        const currImageTags = (await axios.post('http://localhost:3000/currentImageTags', obj)).data

        console.log("tags: ", currImageTags)

        await setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap };

            for (const image in currImageTags) {
                updatedHashmap[image] = currImageTags[image];
                updatedHashmap[image].Price = 0
                updatedHashmap[image].Sales = 0
            }
            return updatedHashmap;
        });
    }

    const images = [...selectedImages];

    const selectedImagesFilenames = selectedImages.map((image, index) => {
        return image.fileName
    })

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

    function handleDateChange(imageName, value) {
        setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap
            updatedHashmap[imageName].Date = value;
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

    return (
        <div className={"mt-[7.5rem] flex flex-col"}>
            <div className={"ml-3 text-slate-700 font-bold text-lg"}>
                Selling {images.length} {images.length > 1 ? "Pictures" : "Picture"}
            </div>
            <div className={"w-full"}>

                <div className={"flex gap-3 flex-col"}>
                    {images.map((image, index) => (
                        <div key={index}
                             className={"mt-2 bg-slate-100 border border-slate-400 p-2 rounded-lg mx-2 flex flex-col max-w-full justify-center items-center content-center text-slate-800"}>
                            <div className="text-left self-start text-slate-600">
                                Picture {index + 1} of {images.length}
                            </div>
                            <div
                                className={"mt-4 flex content-center justify-center items-center w-full h-full col-span-1"}>
                                <Image
                                    thumbnail
                                    src={getImageUrl(image.src)}
                                    alt={image.fileName}
                                    className={`aspect-square max-w-[75%] object-cover outline outline-neutral-500 rounded-xl flex content-center`}
                                />
                            </div>
                            <div className={"w-full mt-4"}>
                                <div
                                    className={"mx-2 flex flex-col gap-2"}>

                                    <div>
                                        <div className={"w-full flex items-center font-bold"}>
                                            Picture Name *
                                        </div>

                                        <div className={"w-full col-span-2"}>
                                            {imageInfo[image.fileName] ? <input
                                                required={true}
                                                value={imageInfo[image.fileName].Name}
                                                onChange={(e) => handleNameChange(image.fileName, e.target.value)}
                                                className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50 invalid:border-red-500"}
                                                placeholder={"Enter Image Name"}
                                            /> : <>Loading...</>}
                                        </div>
                                    </div>

                                    <div>
                                        <div className={"w-full flex items-center font-bold"}>
                                            Location
                                        </div>

                                        <div className={"w-full col-span-2"}>
                                            {imageInfo[image.fileName] ? <input
                                                required={true}
                                                value={imageInfo[image.fileName].Location}
                                                onChange={(e) => handleLocationChange(image.fileName, e.target.value)}
                                                className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50"}
                                                placeholder={"Enter Image Name"}
                                            /> : <>Loading...</>}
                                        </div>
                                    </div>

                                    <div>
                                        <div className={"w-full flex items-center font-bold"}>
                                            Price *
                                        </div>

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
                                                type="number"
                                                onChange={(e) => handlePriceChange(image.fileName, e.target.value)}
                                                className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50 pl-10 invalid:border-red-500"}
                                                placeholder={"Enter Image Price"}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className={"flex flex-col col-span-3 mx-4 py-2 w-full"}>
                                <div className={"w-full font-bold mx-2"}>
                                    Tags:
                                </div>

                                <div className={"w-full col-span-2 mx-2 mr-4 pr-4 flex justify-center items-center"}>
                                    {imageInfo[image.fileName] ?
                                        <TagsInput
                                            onRemoved={(tag) => handleDeleteTag(image.fileName, tag)}
                                            value={imageInfo[image.fileName].Tags}
                                            isEditOnRemove
                                            onChange={(tags) => handleTagsChange(image.fileName, tags)}
                                            name="Enter image tags"
                                            placeHolder="Hit enter to add tags"
                                            classNames={{
                                                input: "flex bg-slate-50 w-full",
                                                tag: "bg-slate-300"
                                            }}

                                        /> : <>Loading...</>}
                                </div>
                            </div>

                            <p className="text-red-500 mt-2 text-xs italic self-start">* Required Fields</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default SellPage;
