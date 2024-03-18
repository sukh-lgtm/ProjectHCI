import {useEffect, useState} from 'react'

import Header from "./components/Header.jsx";
import Actionbar from "./components/Actionbar.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import Library from "./pages/Library.jsx";
import Albums from "./pages/Albums.jsx";
import Explore from "./pages/Explore.jsx";
import Account from "./pages/Account.jsx";
import Navbar from "./components/Navbar.jsx";

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

    return (
        <html lang="en" className="!scroll-smooth">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <body className={"w-screen"}>
        <div className="w-screen">
            <Header selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode}/>
            <Navbar/>
            <div>
                <Routes>
                    <Route path="/library" element={<Library selectionMode={selectionMode} />}/>
                    <Route path="/albums" element={<Albums/>}/>
                    <Route path="/explore" element={<Explore/>}/>
                    <Route path="/account" element={<Account/>}/>
                </Routes>
            </div>
        </div>
        </body>
        </html>
)
}

export default App
