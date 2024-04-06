import {useLocation} from "react-router-dom";
import {Image, Nav} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { TagsInput } from "react-tag-input-component";
import '../tags.css'


function CommonTag({selectedImages}) {
    const [commonImageName, setCommonImageName] = useState(null)
    const[imageLocation, setImageLocation] = useState(null)
    const[imageDate, setImageDate] = useState(null)
    const[imageTags, setImageTags] = useState([])
    let imageTagsString

    useEffect( () => {
        // Call the function to set image tag info when the component is mounted
        setImageTagInfo();
    }, []);

    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }

    const selectedImagesFilenames = selectedImages.map((image, index) => {
        return image.fileName
    })

    async function setImageTagInfo() {
        const obj = {"images": selectedImagesFilenames}
        const currImageTags = (await axios.post('http://localhost:3000/currentImageTags', obj)).data
        let currTags = new Set();
        let currLocation = "";
        let currDate = "";
        for(const image in currImageTags){
            if(currTags.size === 0){
                currTags = currImageTags[image].Tags
            }
            currTags = findCommonElements(currTags, currImageTags[image].Tags)

            if(currLocation === ""){
                currLocation = currImageTags[image].Location
            }
            else if(currLocation !== currImageTags[image].Location){
                currLocation = null
            }

            if(currDate === ""){
                currDate = currImageTags[image].Date
            }
            else if(currDate !== currImageTags[image].Date){
                currDate = null
            }
        }

        await setImageTags(currTags)
        console.log(currTags)

        console.log(currLocation)
        await setImageLocation(currLocation)
        await setImageDate(currDate)
        imageTagsString = currTags.join(",");
    }

    function findCommonElements(arr1, arr2) {
        const commonElements = [];

        arr1.forEach(element => {
            if (arr2.includes(element)) {
                commonElements.push(element);
            }
        });

        return commonElements;
    }


    function addImageTags() {
        const obj = {"images" : selectedImagesFilenames, "Name": commonImageName, "Location": imageLocation, "Date": imageDate, "Tags": imageTags}
        axios.post('http://localhost:3000/commonTagImage', obj).then(r => console.log(r.data))
    }

    // Placeholder data for images
    const images = [...selectedImages]; // Replace [...] with your array of images

    function setImageTagsArray(arr) {
        setImageTags(arr.split(/\s*,\s*/))
    }

    return (
        <>
            {/* Display images */}
            <div className="flex flex-grow mx-auto justify-center items-center w-screen">
                <div className="grid grid-cols-3 auto-cols-auto mx-2 my-2 gap-0.5">
                    {images.map((image, index) => (
                        <div key={index}>
                            <div className={"relative overflow-hidden w-full h-full"}>
                                <Image
                                    thumbnail
                                    src={getImageUrl(image.src)}
                                    alt={image.fileName}
                                    className={`aspect-square w-full h-full object-cover`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={"ml-3 mt-6 text-slate-600 font-bold text-lg"}>
                Add/Edit Common Information:
            </div>

            <div
                className={"mt-2 mx-2 border border-black bg-slate-200 rounded-xl p-2 grid grid-cols-3 grid-auto-rows-auto gap-2"}>

                <div className={"w-full flex items-center font-bold"}>
                    Date:
                </div>

                <div className={"w-full col-span-2"}>
                    <input
                        value={imageDate}
                        type="date"
                        onChange={(e) => setImageDate(e.target.value)}
                        className={"w-full rounded-md border border-slate-400 px-2"}
                    />
                </div>


                <div className={"w-full flex items-center font-bold"}>
                    Location:
                </div>

                <div className={"w-full col-span-2 flex justify-center items-center"}>
                    <input
                        value={imageLocation}
                        onChange={(e) => setImageLocation(e.target.value)}
                        className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm"}
                        placeholder={"Enter the Location"}/>
                </div>


                <div className={"w-full flex items-center font-bold"}>
                    Tags:
                </div>

                <div className={"w-full col-span-2 flex justify-center items-center"}>
                    <TagsInput
                        value={imageTags}
                        onChange={setImageTags}
                        name="Enter image tags"
                        placeHolder="Hit enter to add tags"
                        classNames={{input: "custom-placeholder"}}
                    />
                </div>

            </div>

            <div className={"flex w-full mt-3 justify-end p-3"}>
                <button onClick={addImageTags} className={"px-5 py-2 border rounded-xl bg-blue-600 text-neutral-200 active:shadow-2xl active:bg-blue-200 active:text-neutral-900"}>
                    Save
                </button>
            </div>
        </>
    );
}

function SeparateTag({selectedImages}) {
    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }
    const [imageInfo, setImageInfo] = useState({});
    useEffect( () => {
        // Call the function to set image tag info when the component is mounted
        setImageTagInfo();
    }, []);

    function addImageTags() {
        console.log(imageInfo)
        axios.post('http://localhost:3000/separateTagImage', imageInfo).then(r => console.log(r.data))
    }

    async function setImageTagInfo() {
        const obj = {"images": selectedImagesFilenames}
        const currImageTags = (await axios.post('http://localhost:3000/currentImageTags', obj)).data

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

    const initialImageData = images.map((image) => ({
        Name: '',
        Date: '',
        Location: '',
        Tags: [],
    }));

    const selectedImagesFilenames = selectedImages.map((image, index) => {
        return image.fileName
    })

    const [imageData, setImageData] = useState(initialImageData);

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
        setImageInfo(prevHashmap => {
            const updatedHashmap = { ...prevHashmap }; // Create a copy of the previous hashmap
            updatedHashmap[imageName].Tags = value;
            return updatedHashmap; // Return the updated hashmap
        });
    }

    return (
        <div className={"w-full"}>
            <div className={"ml-3 mt-6 text-slate-600 font-bold text-lg"}>
                Add/Edit Separate Information:
            </div>
            <div className={"flex gap-3 flex-col"}>
                {images.map((image, index) => (
                    <div key={index}
                         className={"mt-2 mx-2 border border-neutral-500 bg-slate-300 rounded-xl p-2 grid grid-cols-3 max-w-full justify-center items-center text-slate-800"}>
                        <div className={"w-full col-span-1"}>
                            <Image
                                thumbnail
                                src={getImageUrl(image.src)}
                                alt={image.fileName}
                                className={`aspect-square w-full h-full object-cover border border-neutral-500 rounded-xl`}
                            />
                        </div>
                        <div className={"col-span-2"}>
                            <div
                                className={"mt-2 mx-2 mr-4 grid grid-cols-3 grid-auto-rows-auto gap-2"}>

                                <div className={"w-full flex items-center font-bold"}>
                                    Name:
                                </div>

                                <div className={"w-full col-span-2"}>
                                    {imageInfo[image.fileName] ? <input
                                        value={imageInfo[image.fileName].Name}
                                        onChange={(e) => handleNameChange(image.fileName, e.target.value)}
                                        className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm"}
                                        placeholder={"Enter Image Name"}
                                    /> : <>Loading...</>}
                                </div>
                                <div className={"w-full flex items-center font-bold"}>
                                    Date:
                                </div>

                                <div className={"w-full col-span-2"}>
                                    {imageInfo[image.fileName] ? <input
                                        value={imageInfo[image.fileName].Date}
                                        type="date"
                                        onChange={(e) => handleDateChange(image.fileName, e.target.value)}
                                        className={"w-full rounded-md border border-slate-400 px-2"}
                                    /> : <>Loading...</>}
                                </div>


                                <div className={"w-full flex items-center font-bold"}>
                                    Location:
                                </div>

                                <div className={"w-full col-span-2 flex justify-center items-center"}>
                                    {imageInfo[image.fileName] ? <input
                                        value={imageInfo[image.fileName].Location}
                                        onChange={(e) => handleLocationChange(image.fileName, e.target.value)}
                                        className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm"}
                                        placeholder={"Enter the Location"}
                                    /> : <>Loading...</>}
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
                                        value={imageInfo[image.fileName].Tags}
                                        onChange={(tags) => handleTagsChange(image.fileName, tags)}
                                        name="Enter image tags"
                                        placeHolder="Hit enter to add tags"
                                        classNames={{input: "custom-placeholder"}}
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
            {/* Display images */}
            {/*    <div className="flex flex-grow mx-auto justify-center items-center w-screen">*/}
            {/*        <div className="grid grid-cols-3 mx-2 my-2 gap-0.5">*/}
            {/*            {images.map((image, index) => (*/}
            {/*                <div key={index}>*/}
            {/*                    <div className={"relative overflow-hidden w-full h-full"}>*/}
            {/*                        <Image*/}
            {/*                            thumbnail*/}
            {/*                            src={getImageUrl(image.src)}*/}
            {/*                            alt={image.fileName}*/}
            {/*                            className={`aspect-square w-full h-full object-cover`}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className={"ml-3 mt-6 text-slate-600 font-bold text-lg"}>*/}
            {/*        Add/Edit Common Information:*/}
            {/*    </div>*/}

            {/*    <div*/}
            {/*        className={"mt-2 mx-2 border border-black bg-slate-200 rounded-xl p-2 grid grid-cols-3 auto-rows-fr gap-2"}>*/}
            {/*        <div className={"w-full flex items-center font-bold"}>*/}
            {/*            Name:*/}
            {/*        </div>*/}

            {/*        <div className={"w-full col-span-2 text-slate-800"}>*/}
            {/*            <input className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm"}*/}
            {/*                   placeholder={"Enter the Name for all Images"}/>*/}
            {/*        </div>*/}

            {/*        <div className={"w-full flex items-center font-bold"}>*/}
            {/*            Date:*/}
            {/*        </div>*/}

            {/*        <div className={"w-full col-span-2"}>*/}
            {/*            <input*/}
            {/*                type="date"*/}
            {/*                onChange={(e) => setDate(e.target.value)}*/}
            {/*                className={"w-full rounded-md border border-slate-400 px-2"}*/}
            {/*            />*/}
            {/*        </div>*/}


            {/*        <div className={"w-full flex items-center font-bold"}>*/}
            {/*            Location:*/}
            {/*        </div>*/}

            {/*        <div className={"w-full col-span-2 flex justify-center items-center"}>*/}
            {/*            <input className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm"}*/}
            {/*                   placeholder={"Enter the Location"}/>*/}
            {/*        </div>*/}


            {/*        <div className={"w-full flex items-center font-bold"}>*/}
            {/*            Tags:*/}
            {/*        </div>*/}

            {/*        <div className={"w-full col-span-2 flex justify-center items-center"}>*/}
            {/*            <input className={"w-full rounded-md border border-slate-400 px-2 placeholder:text-sm"}*/}
            {/*                   placeholder={"Add Tags separated by a comma"}/>*/}
            {/*        </div>*/}

            {/*    </div>*/}
        </div>
    );
}

function TagPage() {

    const [activePage, setActivePage] = useState("common");


    function getImageUrl(path) {
        return new URL(path, import.meta.url).href
    }

    const location = useLocation()
    const images = location.state?.selectedImages
    return (
        <div className={"mt-[7.5rem] flex flex-col"}>

            <Nav
                className="justify-around flex mb-2"
                activeKey={activePage}
                onSelect={(selectedKey) => setActivePage(selectedKey)}
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
