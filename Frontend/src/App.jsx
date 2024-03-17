import {useState} from 'react'

import Header from "./components/Header.jsx";
import Actionbar from "./components/Actionbar.jsx";
import {Route, Routes} from "react-router-dom";
import Library from "./pages/Library.jsx";
import Albums from "./pages/Albums.jsx";
import Explore from "./pages/Explore.jsx";
import Account from "./pages/Account.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <html lang="en" className="!scroll-smooth">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <body className={"w-screen"}>
        <div className="w-screen">
            <Header/>
            <Navbar/>
            <div>
                <Routes>
                    <Route path="/library" element={<Library/>}/>
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
