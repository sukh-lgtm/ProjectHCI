import React, {useEffect, useState} from 'react'

import Header from "./components/Header.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import Library from "./pages/Library.jsx";
import Albums from "./pages/Albums.jsx";
import Explore from "./pages/Explore.jsx";
import Account from "./pages/Account.jsx";
import Navbar from "./components/Navbar.jsx";
import TagPage from "./pages/TagPage.jsx";
import { LibraryProvider } from './context/LibraryProvider.jsx';
import Actionbar from "./components/Actionbar.jsx";
import SellPage from "./pages/SellPage.jsx";
import MyListings from "./pages/MyListings.jsx";

function App() {
    const [count, setCount] = useState(0)
    const [selectionMode, setSelectionMode] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setSelectionMode(false);
    }, [location]);

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
    };

    const locationPath = location.pathname.substring(1)
    const currentPage = locationPath.charAt(0).toUpperCase() + locationPath.slice(1);

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Toggle visibility based on conditions
        switch (currentPage) {
            case 'Tag':
                setVisible(false);
                break;z
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
                <Header currentPage={currentPage} selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode} setSearchTags={setSearchTags}/>
                {visible ? <Navbar/> : null}
                <div>
                    <Routes>
                        <Route path="/library" element={<Library selectionMode={selectionMode} searchTags={searchTags}/>}/>
                        <Route path="/albums" element={<Albums/>}/>
                        <Route path="/explore" element={<Explore/>}/>
                        <Route path="/account" element={<Account/>}/>
                        <Route path="/tag" element={<TagPage/>}/>
                        <Route path="/sell" element={<SellPage/>}/>
                        <Route path="/listings" element={<MyListings/>}/>
                    </Routes>
                </div>
            </LibraryProvider>
        </div>
)
}

export default App
