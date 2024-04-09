
function InsideAlbumActionBar({onRemove, selectedImages}) {
    const onImageSelected = selectedImages.length > 0;

    return (
        <div
            className="px-1 bg-neutral-200 bg-opacity-80 backdrop-blur-2xl fixed bottom-0 w-full z-10 flex flex-col pt-0.5 nav-bar-section border-t border-gray-400">
            <div className="grid grid-cols-4 gap-6">
                <div className={"col-start-1 col-span-3 place-self-center text-slate-700 text-xl font-bold"}>
                    {selectedImages.length === 1 ? `${selectedImages.length} Image Selected` : `${selectedImages.length} Images Selected`}
                </div>
                <button type="button" disabled={!onImageSelected}
                        className={`col-start-4 ${onImageSelected ? "active-action-link" : "action-bar-button"}`}
                        onClick={onRemove}>
                    <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"
                         className="fill-inherit">
                        <g clipPath="url(#clip0_255_2562)">
                            <path
                                d="M8.75033 27.7083C8.75033 29.3125 10.0628 30.625 11.667 30.625H23.3337C24.9378 30.625 26.2503 29.3125 26.2503 27.7083V10.2083H8.75033V27.7083ZM11.667 13.125H23.3337V27.7083H11.667V13.125ZM22.6045 5.83333L21.1462 4.375H13.8545L12.3962 5.83333H7.29199V8.75H27.7087V5.83333H22.6045Z"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_255_2562">
                                <rect width="35" height="35"/>
                            </clipPath>
                        </defs>
                    </svg>

                    <span>
                        Delete
                    </span>
                </button>
            </div>
        </div>
    );

}

export default InsideAlbumActionBar;
