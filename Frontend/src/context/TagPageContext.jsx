import {createContext, useContext, useEffect, useState} from 'react';

const TagContext = createContext();

export const TagProvider = ({ children }) => {
    const [imageLocation, setImageLocation] = useState("");
    const [imageDate, setImageDate] = useState("");
    const [imageTags, setImageTags] = useState([]);
    const [imageInfo, setImageInfo] = useState({});


    return (
        <TagContext.Provider value={{ imageLocation, setImageLocation, imageDate, setImageDate, imageTags, setImageTags, imageInfo, setImageInfo }}>
            {children}
        </TagContext.Provider>
    );
};

export const useCommonTag = () => useContext(TagContext);