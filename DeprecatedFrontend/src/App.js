// import './App.css';
// import Navbar from "./components/Navbar";
// import Header from "./components/Header";
// import {Route, Routes} from "react-router-dom";
// import Actionbar from "./components/Actionbar";
// import Library from "./pages/Library";
//
// function App() {
//   return (
//       <html lang="en" className="!scroll-smooth">
//       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
//       <body>
//       {/*<Header/>*/}
//       {/*/!*<Actionbar/>*!/*/}
//       {/*<Navbar/>*/}
//       {/*<Routes>*/}
//       {/*    <Route path="/" action={<Library/>}/>*/}
//       {/*        */}
//       {/*</Routes>*/}
//       <Routes>
//           <Route/>
//       </Routes>
//       </body>
//       </html>
//   );
// }
//
// export default App;


import Navbar from "./components/Navbar"

import { Route, Routes } from "react-router-dom"
import Library from "./pages/Library";
import Albums from "./pages/Albums";
import Explore from "./pages/Explore";
import Account from "./pages/Account";
import Header from "./components/Header";
import Actionbar from "./components/Actionbar";


function App() {

    return (
        <html lang="en" className="!scroll-smooth">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <body className={"w-screen"}>
            <Header/>
            <Navbar />
            {/*<Actionbar/>*/}
            <div>
                <Routes>
                    <Route path="/library" element={<Library />} />
                    <Route path="/albums" element={<Albums />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/account" element={<Account />} />
                </Routes>
            </div>
        </body>
        </html>
    )
}

export default App
