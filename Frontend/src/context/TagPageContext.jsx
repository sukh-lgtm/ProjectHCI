import {createContext, useContext, useEffect, useState} from 'react';

const TagContext = createContext();

export const TagProvider = ({ children }) => {
    const [imageLocation, setImageLocation] = useState(localStorage.getItem('imageLocation') || "");
    const [imageDate, setImageDate] = useState(localStorage.getItem('imageDate') || "");
    const [imageTags, setImageTags] = useState(JSON.parse(localStorage.getItem('imageTags')) || []);
    const [imageInfo, setImageInfo] = useState(JSON.parse(localStorage.getItem('imageInfo')) || {});


    // Update localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('imageLocation', imageLocation);
        localStorage.setItem('imageDate', imageDate);
        localStorage.setItem('imageTags', JSON.stringify(imageTags));
        localStorage.setItem('imageInfo', JSON.stringify(imageInfo));

    }, [imageLocation, imageDate, imageTags]);

    return (
        <TagContext.Provider value={{ imageLocation, setImageLocation, imageDate, setImageDate, imageTags, setImageTags, imageInfo, setImageInfo }}>
            {children}
        </TagContext.Provider>
    );
};

export const useCommonTag = () => useContext(TagContext);