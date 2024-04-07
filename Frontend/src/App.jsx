import {useEffect, useState} from 'react'

import Header from "./components/Header.jsx";
import Actionbar from "./components/Actionbar.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import Library from "./pages/Library.jsx";
import Albums from "./pages/Albums.jsx";
import Explore from "./pages/Explore.jsx";
import Account from "./pages/Account.jsx";
import Navbar from "./components/Navbar.jsx";
import TagPage from "./pages/TagPage.jsx";
import { LibraryProvider } from './context/LibraryProvider.jsx';
import {TagProvider} from "./context/TagPageContext.jsx";

function App() {
    const [count, setCount] = useState(0)
    const [selectionMode, setSelectionMode] = useState(false);

    const location = useLocation();

    useEffect(() => {
        // Set selectionMode to false whenever the location changes (page changes)
        setSelectionMode(false);
    }, [location]);

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
    };

    const locationPath = location.pathname.substring(1)
    const currentPage = locationPath.charAt(0).toUpperCase() + locationPath.slice(1);

    console.log("Hello 6")

    return (

        <div className= "max-w-screen h-[5000px] bg-gray-300 overflow-x-hidden overflow-hidden" >
            <LibraryProvider>
                <TagProvider>
                    <Header currentPage={currentPage} selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode}/>
                    {!selectionMode ? <Navbar/> : null}
                    <div>
                        <Routes>
                            <Route path="/library" element={<Library selectionMode={selectionMode} />}/>
                            <Route path="/albums" element={<Albums/>}/>
                            <Route path="/explore" element={<Explore/>}/>
                            <Route path="/account" element={<Account/>}/>
                            <Route path="/tag" element={<TagPage/>}/>
                        </Routes>
                    </div>
                </TagProvider>
            </LibraryProvider>
        </div>
)
}

export default App
