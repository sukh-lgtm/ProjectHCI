import {useRef, useState} from "react";
import Axios from "axios";
import {useLibrary} from "../context/LibraryProvider.jsx";
import { Check, X } from 'lucide-react';

function Header({ currentPage, selectionMode, toggleSelectionMode }) {
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
            <div className="fixed top-0 left-0 w-full z-10 p-3 bg-gray-300 bg-opacity-65 backdrop-blur text-neutral-900 border-b border-gray-400">
                <div className="flex flex-row items-center content-center justify-between">
                    <div>
                        <input type="file" id="uploadInput" multiple={true} onChange={handleChange} ref={inputFile}
                               className={"hidden"}/>
                        <button type="submit"
                                className="rounded-[36px] backdrop-blur-[5rem] bg-gray-600 bg-opacity-40 px-2.5 py-1 "
                                onClick={onUploadButtonClick}
                        >
                            <i className="fa fa-upload mr-2"></i>Upload
                        </button>
                    </div>


                    <div className={"text-blue-600 text-xl font-bold"}>
                        {currentPage}
                    </div>

                    <div>
                        <button type="button"
                                className="ml-auto rounded-[36px] backdrop-blur-[5rem] bg-gray-600 bg-opacity-40 px-2.5 py-1"
                                onClick={toggleSelectionMode}>
                            {selectionMode ?
                                <div className={"flex flex-row justify-center items-center content-center gap-1"}><X
                                    width={15} height={15}/> Cancel </div> :
                                <div className={"flex flex-row justify-center items-center content-center gap-1"}><Check
                                    width={15} height={15}/> Select </div>}
                        </button>
                    </div>


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
