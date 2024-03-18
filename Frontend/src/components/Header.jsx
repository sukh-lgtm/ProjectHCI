function Header({ selectionMode, toggleSelectionMode }) {
    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-10 p-3">
                <div className="flex flex-row">
                    <button type="button"
                            className="text-black rounded-[36px] focus:text-blue-600 backdrop-blur-[5rem] bg-gray-400 bg-opacity-40 px-2.5 py-1 ">
                        <i className="fa fa-upload mr-2"></i>Upload
                    </button>
                    <button type="button"
                            className="ml-auto text-black rounded-[36px] backdrop-blur-[5rem] bg-gray-400 bg-opacity-40 px-2.5 py-1 "
                            onClick={toggleSelectionMode}>
                        {selectionMode ? 'Cancel' : 'Select'}
                    </button>
                </div>

                <div className="flex flex-row pt-2">
                    <form className=" mx-auto w-full">
                        <label htmlFor="default-search" className="mb-2 text-gray-900 sr-only">Search</label>
                        <div className="relative w-full flex flex-row">
                            <input type="search" id="default-search"
                                   className="self-center block w-full p-2 ps-10 text-gray-900 border-2 border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 placeholder:self-center"
                                   placeholder="Search photo tags"/>
                            <button type="submit"
                                    className="text-black absolute end-3 bottom-3">
                                <i className="fa fa-search mr-2"></i>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Header;
