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
    const [filterButtonClicked, setFilterButtonClicked] = useState(false);
    const [insideAlbumTitle, setInsideAlbumTitle] = useState("")
    const [newAlbumButton, setAlbumButtonClicked] = useState(false)
    const [addToAlbumButtonClicked, setAddToAlbumButtonClicked] = useState(false)
    const [fullPageImage, setFullPageImage] = useState(false)


    const location = useLocation();

    useEffect(() => {
        if((currentPage !== 'RecentlyDeleted') && (currentPage !== 'InsideAlbum'))
            setSelectionMode(false);

        if(currentPage === 'InsideAlbum')
            fetchInsideAlbumTitle();

    }, [location]);

    const toggleFilterButtonClicked = () => {
        setFilterButtonClicked(!filterButtonClicked)
    }

    const toggleFullPageMode = () => {
        setFullPageImage(!fullPageImage);
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
    };

    const toggleAlbumButtonClicked = () => {
        setAlbumButtonClicked(!newAlbumButton);
    }

    const toggleAddToAlbumButton = () => {
        setAddToAlbumButtonClicked(!addToAlbumButtonClicked);
    }

    const onAddToAlbumClicked = () => {
        toggleAddToAlbumButton(true);
    }

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
            case 'Listings':
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
                    <Header
                        currentPage={currentPage} selectionMode={selectionMode} insideAlbumTitle={insideAlbumTitle} toggleSelectionMode={toggleSelectionMode} 
                        setSearchTags={setSearchTags} newAlbumButton={newAlbumButton} toggleNewAlbumButtonClicked={toggleAlbumButtonClicked} onAddToAlbumButtonClicked={onAddToAlbumClicked}
                        setFilterButtonClicked={setFilterButtonClicked} toggleFilterButtonClicked={toggleFilterButtonClicked} filterButtonClicked={filterButtonClicked} fullPageImage={fullPageImage} toggleFullPageMode={toggleFullPageMode}
                    />
                    {visible ? <Navbar /> : null}
                    <div>
                        <Routes>
                            <Route path="/library" element={<Library selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode} searchTags={searchTags} fullPageImage={fullPageImage} toggleFullPageMode={toggleFullPageMode}/>} />
                            <Route path="/albums" element={<Albums selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode} newAlbumButton={newAlbumButton}/>} />
                            <Route path="/explore" element={<Explore filterButtonClicked={filterButtonClicked} toggleFilterButtonClicked={toggleFilterButtonClicked} searchTags={searchTags}/>} />
                            <Route path="/account" element={<Account setVisible={setVisible}/>}/>
                            <Route path="/tag" element={<TagPage />} />
                            <Route path="/sell" element={<SellPage />} />
                            <Route path="/listings" element={<MyListings />} />
                            <Route path="/recentlyDeleted" element={<RecentlyDeleted selectionMode={selectionMode} setSelectionMode={setSelectionMode}/>}/>
                            <Route path="/insideAlbum" element={<InsideAlbum selectionMode={selectionMode} albumTitle={insideAlbumTitle} fetchInsideAlbumTitle={fetchInsideAlbumTitle} setSelectionMode={setSelectionMode}/>} />
                            <Route path="/libInAlbum" element={<LibInAlbum 
                                selectionMode={selectionMode} albumTitle={insideAlbumTitle} fetchInsideAlbumTitle={fetchInsideAlbumTitle} setSelectionMode={setSelectionMode}
                                addToAlbumButtonClicked={addToAlbumButtonClicked} setAddToAlbumButtonClicked={setAddToAlbumButtonClicked}/>} 
                            />
                        </Routes>
                    </div>
                </AlbumsProvider>
            </LibraryProvider>
        </div>
)
}

export default App
