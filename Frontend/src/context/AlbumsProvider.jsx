import React, {createContext, useContext, useCallback, useEffect, useState, useRef} from 'react';
import Axios from "axios";

const AlbumsContext = createContext();

export const useAlbums = () => {
    const context = useContext(AlbumsContext);
    if (!context) {
        throw new Error('useAlbums must be used within an AlbumsProvder');
    }
    return context;
};

export const AlbumsProvider = ({ children }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    async function handleChange(event) {
        if (event.target.files) {
            await uploadFiles(event.target.files);
        }

    }
    const onUploadButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const inputFile = useRef(null)

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const response = await Axios.get('http://localhost:3000/fetch-albums');
            const albumList = response.data.albums;
            setAlbums(albumList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Albums:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    return (
        <AlbumsContext.Provider value={{ albums, loading, fetchAlbums, setAlbums}}>
            {children}
        </AlbumsContext.Provider>
    );
};