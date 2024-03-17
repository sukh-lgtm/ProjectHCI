function Header() {
    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-10 p-3">
                <div className="flex flex-row">
                    <button type="button"
                            className="text-black rounded-[36px] focus:text-blue-600 backdrop-blur-[5rem] bg-gray-400 bg-opacity-40 px-2.5 py-1 ">
                        <i className="fa fa-upload mr-2"></i>Upload
                    </button>
                    <button type="button"
                            className="ml-auto focus:text-blue-600 text-black rounded-[36px] backdrop-blur-[5rem] bg-gray-400 bg-opacity-40 px-2.5 py-1 ">
                        Cancel
                    </button>
                </div>

                <div className="flex flex-row pt-2">
                    <form className=" mx-auto w-full">
                        <label htmlFor="default-search" className="mb-2 text-gray-900 sr-only">Search</label>
                        <div className="relative w-full flex flex-row">
                            <input type="search" id="default-search"
                                   className="self-center block w-full p-2 ps-10 text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 placeholder:self-center"
                                   placeholder="Search Photos"/>
                            <button type="submit"
                                    className="text-black absolute end-2 bottom-2 rounded-lg px-4 py-2">
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
