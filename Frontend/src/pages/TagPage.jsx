import {useLocation} from "react-router-dom";
import {Image, Nav} from "react-bootstrap";
import React, {useState} from "react";

function CommonTag({selectedImages}) {
    // Function to get image URL
    function getImageUrl(path) {
        return new URL(path, import.meta.url).href;
    }

    // Placeholder data for images
    const images = [...selectedImages]; // Replace [...] with your array of images

    return (
        <>
            {/* Display images */}
            <div className="flex flex-grow mx-auto justify-center items-center w-screen">
                <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52">
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
        </>
    );
}

function SeparateTag() {
    // Separate Tag Page
    return <div>Separate Tag Page</div>;
}

function TagPage() {

    const [activePage, setActivePage] = useState("common");


    function getImageUrl(path) {
        return new URL(path, import.meta.url).href
    }

    const location = useLocation()
    console.log(location.state?.selectedImages)
    const images = location.state?.selectedImages
    return (
        <div className={"mt-28 flex flex-col"}>

            <Nav
                className="justify-content-center flex"
                activeKey={activePage}
                onSelect={(selectedKey) => setActivePage(selectedKey)}
            >
                <Nav.Item>
                    <Nav.Link eventKey="common">Common Tag</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="separate">Separate Tag</Nav.Link>
                </Nav.Item>
            </Nav>

            <div>
                {activePage === "common" ? <CommonTag selectedImages={images}/> : <SeparateTag />}
            </div>
        </div>
    );
}

export default TagPage;
