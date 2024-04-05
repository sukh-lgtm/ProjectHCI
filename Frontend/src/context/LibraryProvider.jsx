import React, {createContext, useContext, useCallback, useEffect, useState, useRef} from 'react';
import Axios from "axios";

const LibraryContext = createContext();

export const useLibrary = () => {
    const context = useContext(LibraryContext);
    if (!context) {
        throw new Error('useLibrary must be used within a LibraryProvider');
    }
    return context;
};

export const LibraryProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    async function handleChange(event) {
        if (event.target.files) {
            await uploadFiles(event.target.files);
        }

    }
    async function uploadFiles(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }


        try {
            const response = await Axios.post(
                'http://localhost:3000/upload',
                formData// Data object
            );
        } catch (error) {
            console.error('Error uploading images:', error);
        }

        fetchImages()
    }
    const onUploadButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const inputFile = useRef(null)

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await Axios.get('http://localhost:3000/fetch-images');
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
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <LibraryContext.Provider value={{ images, loading, fetchImages, setImages}}>
            {children}
        </LibraryContext.Provider>
    );
};
