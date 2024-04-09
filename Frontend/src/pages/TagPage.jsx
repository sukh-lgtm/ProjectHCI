import {useLocation} from "react-router-dom";
import {Image, Nav} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { TagsInput } from "react-tag-input-component";
import '../tags.css'

function CommonTag({selectedImages}) {

    const [imageLocation, setImageLocation] = useState("");
    const [imageDate, setImageDate] = useState("");
    const [imageTags, setImageTags] = useState([]);


    const selectedImagesFilenames = selectedImages.map((image) => {
        return image.fileName
    })

    useEffect(  () => {
        console.log("Called here now")
        setImageTagInfo().then();
    }, []);

    const [dependencyChange, setDependencyChange] = useState(false);

    useEffect(() => {
        if(dependencyChange){
            addImageTags();
        }
        setDependencyChange(false)
    }, [dependencyChange]);

    useEffect(() => {
        setDependencyChange(true)
    }, [imageTags, imageLocation, imageDate]);


    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }

    async function setImageTagInfo() {
        const obj = {"images": selectedImagesFilenames}
        console.log("Object here :", obj)
        const currImageTags = (await axios.post('https://localhost:3000/currentImageTags', obj)).data
        console.log("Data from backend: " , currImageTags)
        let currTags = [];
        let currLocation = "";
        let currDate = "";

        let locationUpdated = false;
        let tagsUpdated = false;
        let dateUpdated = false;
        for(const image in currImageTags){
            if(!tagsUpdated){
                currTags = currImageTags[image].Tags
                tagsUpdated = true
            }
            currTags = findCommonElements(currTags, currImageTags[image].Tags)

            if(!locationUpdated){
                currLocation = currImageTags[image].Location
                locationUpdated = true
            }
            else if(currLocation !== currImageTags[image].Location){
                currLocation = ""
            }

            if(!dateUpdated){
                currDate = currImageTags[image].Date
                dateUpdated = true
            }
            else if(currDate !== currImageTags[image].Date){
                currDate = ""
            }
        }
        setImageTags(currTags)
        setImageDate(currDate)
        setImageLocation(currLocation)
    }

    function findCommonElements(arr1, arr2) {
        const commonElements = [];

        console.log("arr2: ", arr2)

        arr1.forEach(element => {
            if (arr2.includes(element)) {
                commonElements.push(element);
            }
        });

        return commonElements;
    }

    function addImageTags() {
        const obj = {"images" : selectedImagesFilenames, "Location": imageLocation, "Date": imageDate, "Tags": imageTags}
        axios.post('https://localhost:3000/updateCommonTags', obj).then(r => console.log(r.data))
    }

    // Placeholder data for images
    const images = [...selectedImages]; // Replace [...] with your array of images


    function handleTagsChange(tags) {
        console.log(tags)
        setImageTags(tags)
        console.log("")
    }

    function handleDeleteTag(tag) {
        const obj = {"images" : selectedImagesFilenames, "tag": tag}
        axios.post('https://localhost:3000/deleteTag', obj).then()
    }

    return (
        <div className={"min-h-screen"}>
            {/* Display images */}
            <div className="flex flex-grow mx-auto justify-center items-center w-screen ">
                <div className="grid grid-cols-3  mx-2 my-2 gap-0.5">
                    {images.map((image, index) => (
                        <div key={index}>
                            <div className={"relative overflow-hidden w-full h-full"}>
                                <Image
                                    thumbnail
                                    src={getImageUrl(image.src)}
                                    alt={image.fileName}
                                    className={`aspect-square w-full h-full object-cover rounded-xl`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={"ml-3 mt-6 text-slate-700 font-bold text-lg"}>
                Edit Common Information:
            </div>

            <div
                className={"mt-2 mx-2 border border-black rounded-xl p-2 flex flex-col gap-4 text-slate-800 shadow-xl bg-slate-200"}>

                <div className={"flex flex-col w-full"}>
                    <div className={"w-full flex items-center font-bold"}>
                        Date:
                    </div>

                    <div className={"w-full"}>
                        <input
                            value={imageDate}
                            type="date"
                            onChange={(e) => {
                                setImageDate(e.target.value)
                            }}
                            className={"w-full rounded-md border border-slate-400 px-2 py-2 bg-slate-50"}
                        />
                    </div>
                </div>


                <div className={"flex flex-col w-full"}>
                    <div className={"w-full flex font-bold"}>
                        Location:
                    </div>

                    <div className={"w-full flex justify-center"}>
                        <input
                            value={imageLocation}
                            onChange={(e) => {
                                setImageLocation(e.target.value)
                            }}
                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-2 bg-slate-50"}
                            placeholder={"Enter the Location"}/>
                    </div>
                </div>

                <div className={"flex flex-col w-full"}>
                    <div className={"w-full flex font-bold"}>
                        Tags:
                    </div>

                    <div className={"w-full flex justify-center items-center"}>
                        <TagsInput
                            value={[...imageTags]}
                            onRemoved={(tag) => {
                                handleDeleteTag(tag)
                            }}
                            onChange={(tags) => {
                                handleTagsChange(tags)
                            }}
                            name="Enter image tags"
                            placeHolder="Hit enter to add tags"
                            classNames={{input: "w-full placeholder:text-[0.85rem] bg-slate-50", tag: "bg-slate-300"}}
                        />
                    </div>
                </div>


            </div>

            <div className={"flex w-full mt-3 justify-end p-3"}>
                <button onClick={addImageTags}
                        className={"px-5 py-2  rounded-xl bg-blue-600 text-neutral-100 active:shadow-2xl active:bg-blue-600 active:text-neutral-900"}>
                    Save
                </button>
            </div>
        </div>
    );
}

function SeparateTag({selectedImages}) {
    const [imageInfo, setImageInfo] = useState({});

    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }

    useEffect(() => {
        // Call the function to set image tag info when the component is mounted
        setImageTagInfo().then();
    }, [selectedImages]);

    useEffect(() => {
        console.log("Hello there")
        addImageTags()
    }, [imageInfo]);

    function addImageTags() {
        console.log(imageInfo)
        axios.post('https://localhost:3000/updateSeparateTags', imageInfo).then(r => console.log(r.data))
    }

    async function setImageTagInfo() {
        const obj = {"images": selectedImagesFilenames}
        const currImageTags = (await axios.post('https://localhost:3000/currentImageTags', obj)).data

        console.log("tags: ", currImageTags)

        await setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap

            // Update the copy with new image tags
            for (const image in currImageTags) {
                updatedHashmap[image] = currImageTags[image];
            }
            return updatedHashmap; // Return the updated hashmap
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
        console.log("Object hererererere", obj)
        axios.post('https://localhost:3000/deleteTag', obj).then()
    }

    return (
        <div className={"w-full"}>
            <div className={"ml-3 mt-6 text-slate-700 font-bold text-lg"}>
                Edit Separate Information:
            </div>
            <div className={"flex gap-3 flex-col"}>
                {images.map((image, index) => (
                    <div key={index}
                         className={"mt-2 border border-neutral-500 bg-slate-200 p-2 rounded-lg mx-2 grid grid-cols-2 max-w-full justify-center items-center text-slate-800 shadow-xl"}>
                        <div className={"w-full h-full col-span-1"}>
                            <Image
                                thumbnail
                                src={getImageUrl(image.src)}
                                alt={image.fileName}
                                className={`aspect-square w-full h-full object-cover outline outline-neutral-500 rounded-xl`}
                            />
                        </div>
                        <div className={"col-span-1"}>
                            <div
                                className={"mx-2 mr-4 flex flex-col gap-1"}>

                                <div>
                                    <div className={"w-full flex items-center font-bold"}>
                                        Name:
                                    </div>

                                    <div className={"w-full col-span-2"}>
                                        {imageInfo[image.fileName] ? <input
                                            value={imageInfo[image.fileName].Name}
                                            onChange={(e) => handleNameChange(image.fileName, e.target.value)}
                                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50"}
                                            placeholder={"Enter Image Name"}
                                        /> : <>Loading...</>}
                                    </div>
                                </div>

                                <div>
                                    <div className={"w-full flex items-center font-bold"}>
                                        Date:
                                    </div>

                                    <div className={"w-full col-span-2"}>
                                        {imageInfo[image.fileName] ? <input
                                            value={imageInfo[image.fileName].Date}
                                            type="date"
                                            onChange={(e) => handleDateChange(image.fileName, e.target.value)}
                                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50"}
                                        /> : <>Loading...</>}
                                    </div>
                                </div>


                                <div>
                                    <div className={"w-full flex items-center font-bold"}>
                                        Location:
                                    </div>

                                    <div className={"w-full col-span-2 flex justify-center items-center"}>
                                        {imageInfo[image.fileName] ? <input
                                            value={imageInfo[image.fileName].Location}
                                            onChange={(e) => handleLocationChange(image.fileName, e.target.value)}
                                            className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm py-1 bg-slate-50"}
                                            placeholder={"Enter the Location"}
                                        /> : <>Loading...</>}
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className={"col-span-3 mt-2 mr-4 py-2"}>
                            <div className={"w-full flex items-center font-bold"}>
                                Tags:
                            </div>

                            <div className={"w-full col-span-2 flex justify-center items-center"}>
                                {imageInfo[image.fileName] ?
                                    <TagsInput
                                        onRemoved={(tag) => handleDeleteTag(image.fileName, tag)}
                                        value={imageInfo[image.fileName].Tags}
                                        isEditOnRemove
                                        onChange={(tags) => handleTagsChange(image.fileName, tags)}
                                        name="Enter image tags"
                                        placeHolder="Hit enter to add tags"
                                        classNames={{input: "w-full placeholder:text-[0.85rem] bg-slate-50", tag: "bg-slate-300"}}

                                    /> : <>Loading...</>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={"flex w-full mt-3 justify-end p-3"}>
                <button onClick={addImageTags}
                        className={"px-5 py-2 border rounded-xl bg-blue-600 text-neutral-200 active:shadow-2xl active:bg-blue-200 active:text-neutral-900"}>
                    Save
                </button>
            </div>
        </div>
    );
}

function TagPage() {

    const [activePage, setActivePage] = useState("common");


    const handleNavSelect = (selectedKey) => {
        setActivePage(selectedKey)
    };


    const location = useLocation()
    const images = location.state?.selectedImages
    return (
            <div className={"mt-[7.5rem] flex flex-col min-h-screen"}>

                <Nav
                    className="justify-around flex mb-2"
                    activeKey={activePage}
                    onSelect={handleNavSelect}
                >
                    <Nav.Item>
                        <Nav.Link eventKey="common" className={`text-black p-2 px-4 bg-gray-200 rounded-xl ${activePage === "common" ? 'outline outline-blue-500  text-blue-500' : ''}`}>Common Tag</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="separate" className={`text-black p-2 px-4 bg-gray-200 rounded-xl ${activePage === "separate" ? 'outline outline-blue-500 text-blue-500' : ''}`}>Separate Tags</Nav.Link>
                    </Nav.Item>
                </Nav>

                <div>
                    {activePage === "common" ? <CommonTag selectedImages={images}/> : <SeparateTag selectedImages={images}/>}
                </div>

            </div>
    );
}

export default TagPage;
