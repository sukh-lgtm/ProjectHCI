function Header({ selectionMode, toggleSelectionMode }) {
    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-10 p-3 bg-gray-800 bg-opacity-65 backdrop-blur text-neutral-300">
                <div className="flex flex-row">
                    <button type="button"
                            className="rounded-[36px] focus:text-blue-600 backdrop-blur-[5rem] bg-gray-200 bg-opacity-40 px-2.5 py-1 ">
                        <i className="fa fa-upload mr-2"></i>Upload
                    </button>
                    <button type="button"
                            className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-gray-200 bg-opacity-40 px-2.5 py-1 "
                            onClick={toggleSelectionMode}>
                        {selectionMode ? 'Cancel' : 'Select'}
                    </button>
                </div>

                <div className="flex flex-row pt-2 text-neutral-300">
                    <form className=" mx-auto w-full">
                        <label htmlFor="default-search" className="mb-2  sr-only">Search</label>
                        <div className="relative w-full flex flex-row">
                            <input type="search" id="default-search"
                                   className="self-center block w-full p-2 ps-10  border-2 border-gray-500 rounded-full bg-gray-700 focus:ring-blue-500 placeholder:self-center"
                                   placeholder="Search photo tags"/>
                            <button type="submit"
                                    className="text-black absolute start-3 bottom-3 ml-1">
                                <i className="fa fa-search mr-2 text-neutral-300"></i>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Header;
