import './App.css';
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Actionbar from "./components/Actionbar";

function App() {
  return (
      <html lang="en" className="!scroll-smooth">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      <body>
      <Header/>
      <Actionbar/>
      {/*<Navbar/>*/}
      </body>
      </html>
  );
}

export default App;
