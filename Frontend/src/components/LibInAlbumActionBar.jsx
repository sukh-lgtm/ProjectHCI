
function LibInAlbumActionBar({ selectedImages}) {
    return (
        <div
            className="px-1 bg-neutral-200 bg-opacity-80 backdrop-blur-2xl fixed bottom-0 w-full z-50 flex flex-col pt-0.5 nav-bar-section border-t border-gray-400">
            <div className="grid grid-cols-3 gap-6 h-[67px]">
                <div className={"flex grow place-self-center col-start-2 text-slate-700 text-xl text-nowrap font-bold"}>
                    {selectedImages.length === 1 ? `${selectedImages.length} Image Selected` : `${selectedImages.length} Images Selected`}
                </div>
            </div>
        </div>
    );

}

export default LibInAlbumActionBar;