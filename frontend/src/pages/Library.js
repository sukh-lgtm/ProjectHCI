import React, {useState} from 'react';

import { Image } from 'react-bootstrap'

function Library() {
    const [allImages, setAllImages] = useState([]);
    const handleClick = async (source) => {
        const check = allImages.includes(source)
        if (check) {
            const id = allImages.indexOf(source)
            let newArr = allImages
            newArr.splice(id, 1)
            setAllImages([...newArr])
        } else {
            allImages.push(source)
            setAllImages([...allImages])
        }
    }

    const images = require.context('../images/', true);

    return (
        <div className="flex mt-24 flex-grow mx-auto justify-center items-center w-screen">
            <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52">
                {images.keys().map((image, index) => (
                    <Image className={"image-container"} src={require("../images/" + image.split('/').pop())} />

                ))}
            </div>
        </div>
    )
}

export default Library;
