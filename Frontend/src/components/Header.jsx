import {useRef, useState} from "react";
import Axios from "axios";
import {useLibrary} from "../context/LibraryProvider.jsx";

function Header({ selectionMode, toggleSelectionMode }) {
    const { fetchImages } = useLibrary();

    async function handleChange(event) {
        if (event.target.files) {
            await uploadFiles(event.target.files);
        }

    }
    async function uploadFiles(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }


        try {
            const response = await Axios.post(
                'http://localhost:3000/upload',
                formData// Data object
            );
        } catch (error) {
            console.error('Error uploading images:', error);
        }

        fetchImages()
    }
    const onUploadButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const inputFile = useRef(null)

    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-10 p-3 bg-gray-300 bg-opacity-65 backdrop-blur text-neutral-900">
                <div className="flex flex-row">
                    <input type="file" id="uploadInput" multiple={true} onChange={handleChange} ref={inputFile} className={"hidden"}/>
                    <button type="submit"
                            className="rounded-[36px] backdrop-blur-[5rem] bg-gray-600 bg-opacity-40 px-2.5 py-1 "
                            onClick={onUploadButtonClick}
                    >
                        <i className="fa fa-upload mr-2"></i>Upload
                    </button>

                    <button type="button"
                            className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-gray-800 bg-opacity-40 px-2.5 py-1 "
                            onClick={toggleSelectionMode}>
                        {selectionMode ? 'Cancel' : 'Select'}
                    </button>
                </div>

                <div className="flex flex-row pt-2 text-neutral-300">
                    <form className=" mx-auto w-full">
                        <label htmlFor="default-search" className="mb-2  sr-only">Search</label>
                        <div className="relative w-full flex flex-row">
                            <input type="search" id="default-search"
                                   className="self-center block w-full p-2 ps-10 text-neutral-900 border border-gray-400 rounded-full bg-gray-200 focus:outline-blue-600 placeholder:self-center"
                                   placeholder="Search photo tags"/>
                            <button type="submit"
                                    className="text-neutral-900 absolute start-3 bottom-3 ml-1">
                                <i className="fa fa-search mr-2 text-neutral-900"></i>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Header;
