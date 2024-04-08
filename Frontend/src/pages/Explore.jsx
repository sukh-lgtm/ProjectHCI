import React, { useState, useRef, createRef } from "react";
import Saleinfo from "./Saleinfo";
import data from "../../../Backend/explore_images/explorePictures.json";


function Explore() {
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const searchInputRef = createRef();
  const maxPriceInputRef = createRef();


  const filteredData = data
    .filter((image) => {
      if (!selectedAuthor || !image.author) return true;
      return image.author === selectedAuthor;
    })
    .filter((image) => parseInt(image.price.replace("$", "")) <= maxPrice);


  const [selectedItem, setSelectedItem] = useState(null);
  const openPreviewHandler = (item) => {
    setSelectedItem(item);
  };
  const closePreviewHandler = () => {
    setSelectedItem(null);
  };


  //Filters popup
  const Filters = () => {
    const [isVisible, setIsVisible] = useState(false);
    const myRef = useRef();


    const handleClick = () => {
      setIsVisible(!isVisible);
    };


    return (
      <div>
        <div
          className={`grid grid-cols-2 gap-4 fixed top-0 left-0 ${isVisible ? "" : "hidden"}`}
          ref={myRef}
        >
          <div className="bg-gray-300 rounded-lg shadow-xl mt-28">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedAuthor(searchInputRef.current.value);
                if (maxPriceInputRef.current.value == "") {
                setMaxPrice(Infinity);
                } else {
                setMaxPrice(parseInt(maxPriceInputRef.current.value));
                }
              }}
            >
              <input className="border w-full h-full p-2"
                ref={searchInputRef}
                type="text"
                placeholder="Search Author..."
              />
              <input className="border w-full h-full p-2"
                ref={maxPriceInputRef}
                type="text"
                placeholder="Max price... "
              />
              <button className="backdrop-blur-[5rem] bg-gray-600 bg-opacity-40 px-2.5 py-1 rounded-3xl m-1" type="submit">Filter</button>
            </form>
          </div>
        </div>
        <button className="pt-28" onClick={handleClick}>
          Toggle
        </button>
      </div>
    );
  };
// Toggle button is temporary 

  return (
    <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52 mt-28">
      {filteredData.map((image, index) => {
        return (
          <React.Fragment key={index}>
            <div className=" bg-white rounded-lg shadow-xl">
              <img
                onClick={openPreviewHandler.bind(this, image)}
                src={image.url}
                alt=""
                className="rounded-lg"
              />
              <div className="flex items-end justify-center">
                <p className="mr-4">{image.title}</p>
                <p className=" text-green-600">{image.price}</p>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {selectedItem !== null ? (
        <Saleinfo
          show={true}
          onClose={closePreviewHandler}
          title={selectedItem.title || ""}
          description={selectedItem.description || ""}
          price={selectedItem.price}
          preview={selectedItem.url}
          author={selectedItem.author}
          date={selectedItem.dateTaken}
        />
      ) : null}
      <Filters />
    </div>
  );
}


export default Explore;