import React, {useEffect, useState} from 'react'

import Header from "./components/Header.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import Library from "./pages/Library.jsx";
import Albums from "./pages/Albums.jsx";
import Explore from "./pages/Explore.jsx";
import Account from "./pages/Account.jsx";
import Navbar from "./components/Navbar.jsx";
import TagPage from "./pages/TagPage.jsx";
import RecentlyDeleted from './pages/RecentlyDeleted.jsx';
import { LibraryProvider } from './context/LibraryProvider.jsx';
import { AlbumsProvider } from './context/AlbumsProvider.jsx';
import Actionbar from "./components/Actionbar.jsx";
import SellPage from "./pages/SellPage.jsx";
import MyListings from "./pages/MyListings.jsx";
import InsideAlbum from './pages/InsideAlbum.jsx';
import LibInAlbum from './pages/LibInAlbum.jsx';

function App() {
    const [count, setCount] = useState(0)
    const [selectionMode, setSelectionMode] = useState(false);
    const [insideAlbumTitle, setInsideAlbumTitle] = useState("")

    const location = useLocation();

    useEffect(() => {
        if((currentPage !== 'RecentlyDeleted') && (currentPage !== 'InsideAlbum'))
            setSelectionMode(false);

        if(currentPage === 'InsideAlbum')
            fetchInsideAlbumTitle();

    }, [location]);

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
    };

    const fetchInsideAlbumTitle = async () => {
        setInsideAlbumTitle(location.search.split("=")[1])
    }

    const locationPath = location.pathname.substring(1)
    const currentPage = locationPath.charAt(0).toUpperCase() + locationPath.slice(1);

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Toggle visibility based on conditions
        switch (currentPage) {
            case 'Tag':
                setVisible(false);
                break;
            case 'Sell':
                setVisible(false);
                break;
            default:
                setVisible(!selectionMode);
                break;
        }
    }, [currentPage, selectionMode]);

    const [searchTags, setSearchTags] = useState([])


    return (

        <div className= "max-w-screen bg-gray-300 overflow-x-hidden overflow-hidden" >
            <LibraryProvider>
                <AlbumsProvider>
                    <Header currentPage={currentPage} selectionMode={selectionMode} insideAlbumTitle={insideAlbumTitle} toggleSelectionMode={toggleSelectionMode} setSearchTags={setSearchTags}/>
                    {visible ? <Navbar /> : null}
                    <div>
                        <Routes>
                            <Route path="/library" element={<Library selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode} searchTags={searchTags}/>} />
                            <Route path="/albums" element={<Albums selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode}/>} />
                            <Route path="/explore" element={<Explore />} />
                            <Route path="/account" element={<Account selectionMode={selectionMode} />}/>
                            <Route path="/tag" element={<TagPage />} />
                            <Route path="/sell" element={<SellPage />} />
                            <Route path="/listings" element={<MyListings />} />
                            <Route path="/recentlyDeleted" element={<RecentlyDeleted selectionMode={selectionMode} setSelectionMode={setSelectionMode}/>}/>
                            <Route path="/insideAlbum" element={<InsideAlbum selectionMode={selectionMode} albumTitle={insideAlbumTitle} fetchInsideAlbumTitle={fetchInsideAlbumTitle} setSelectionMode={setSelectionMode}/>} />
                            <Route path="/libInAlbum" element={<LibInAlbum selectionMode={selectionMode} albumTitle={insideAlbumTitle} fetchInsideAlbumTitle={fetchInsideAlbumTitle} setSelectionMode={setSelectionMode}/>} />
                        </Routes>
                    </div>
                </AlbumsProvider>
            </LibraryProvider>
        </div>
)
}

export default App
