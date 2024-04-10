import React, {useState, useRef, createRef, useEffect} from 'react'
import Saleinfo from './Saleinfo';
import data from '../../../Backend/api/explore_images/explorePictures.json';
export default Explore;


function Explore({filterButtonClicked, toggleFilterButtonClicked, searchTags}) {
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [maxPrice, setMaxPrice] = useState(Infinity);
    const searchInputRef = createRef();
    const maxPriceInputRef = createRef();
    const [isVisible, setIsVisible] = useState(false);

    const [filteredData, setFilteredData] = useState([])



    useEffect(() => {
        const filteredDatas = data
            .filter((image) => {
                if (!selectedAuthor || !image.author) return true;
                return image.author === selectedAuthor;
            })
            .filter((image) => parseInt(image.price.replace("$", "")) <= maxPrice)
        setFilteredData(filteredDatas)
    }, []);

    useEffect(() => {
        if(!maxPrice){
            setMaxPrice(Infinity)
        }
        const filteredDatas =  data
            .filter((image) => {
                if (!selectedAuthor || !image.author) return true;
                return image.author === selectedAuthor;
            })
            .filter((image) => parseInt(image.price.replace("$", "")) <= maxPrice)
            .filter((image) => {
                if(searchTags && searchTags.length > 0){
                    if(image.tags && image.tags.length > 0){
                        console.log("Goog to go")

                        console.log("This , ", searchTags.every(tag => {image.tags.includes(tag)}))
                        return searchTags.some(tag => {return image.tags.includes(tag)});
                    }
                    else{
                        return false
                    }
                }
                else{
                    return true
                }
            })
        setFilteredData(filteredDatas)
    }, [searchTags, maxPrice, selectedAuthor]);

    useEffect(() => {
        setIsVisible(filterButtonClicked);
    }, [filterButtonClicked]);


    const [selectedItem, setSelectedItem] = useState(null);
    const openPreviewHandler = (item) => {
        setSelectedItem(item);
    };
    const closePreviewHandler = () => {
        setSelectedItem(null);
    };

    return (
        <div className={"min-h-screen"}>
            {isVisible && (<div>
                <div
                    className={`flex flex-col mx-4 gap-4 ${isVisible ? "" : "hidden"}`}
                >

                    <div className="bg-gray-300 rounded-lg shadow-xl mt-28">
                        <div className={"text-slate-700 font-bold ml-4"}>
                            Add Filters
                        </div>
                        <form className={"flex flex-col w-full gap-2"}
                              onSubmit={(e) => {
                                  e.preventDefault();
                                  setSelectedAuthor(searchInputRef.current.value);
                                  if (maxPriceInputRef.current.value === "") {
                                      setMaxPrice(Infinity);
                                  } else {
                                      setMaxPrice(parseInt(maxPriceInputRef.current.value));
                                  }
                              }}
                        >
                            <input
                                className="border  h-full p-2 text-neutral-900 border-gray-400 bg-gray-100 mx-4 rounded-md"
                                value={selectedAuthor}
                                ref={searchInputRef}
                                onChange={(e) => {setSelectedAuthor(e.target.value)}}
                                type="text"
                                placeholder="Search Author..."
                            />
                            <input
                                className="border  h-full p-2 text-neutral-900 border-gray-400 bg-gray-100 mx-4 rounded-md"
                                ref={maxPriceInputRef}
                                value={maxPrice}
                                onChange={(e) => {setMaxPrice(parseInt(e.target.value))}}
                                type="number"
                                placeholder="Max price... "
                            />
                            <div className={"flex w-full justify-between"}>
                                <button
                                    className="backdrop-blur-[5rem] outline outline-slate-400 my-4 mx-2 bg-opacity-40 text-red-500 px-2.5 py-1 rounded-3xl m-1 self-start text-sm"
                                    type="submit"
                                    onClick={() => {
                                        searchInputRef.current.value = ""; // clear search input
                                        maxPriceInputRef.current.value = ""; // clear max price input
                                        setSelectedAuthor(""); // reset selected author
                                        setMaxPrice(Infinity); // reset max price
                                    }}> Reset Filters
                                </button>
                                <button
                                    className="backdrop-blur-[5rem] outline outline-blue-800 my-4 mx-2 bg-opacity-40 text-blue-800 px-2.5 py-1 rounded-3xl m-1 self-end text-sm"
                                    type="submit"
                                    onClick={toggleFilterButtonClicked}> Apply Filters
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>)}
            <div className={`grid grid-cols-2 mx-2 my-2 gap-4 mb-52 ${isVisible ? 'mt-4' : 'mt-28'}`}>
                {filteredData.map((image, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="rounded-lg shadow-xl bg-gray-100">
                                <img
                                    onClick={openPreviewHandler.bind(this, image)}
                                    src={image.url}
                                    alt=""
                                    className="rounded-lg"
                                />
                                <div className="ml-3 mt-2 flex justify-center flex-col">
                                    <p className="mr-4">Name: {image.title}</p>
                                    <p className="text-green-700 flex gap-1"><p
                                        className={"text-slate-700"}>Price:</p> {image.price}</p>
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
                        tags={selectedItem.tags || []}
                        price={selectedItem.price}
                        preview={selectedItem.url}
                        author={selectedItem.author}
                        date={selectedItem.dateTaken}
                        location={selectedItem.location}
                    />
                ) : null}

            </div>
        </div>

    );
}
