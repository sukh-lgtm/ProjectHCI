import { Plus } from 'lucide-react'

function LibInAlbumActionBar({ selectedImages, onAdd}) {

    const onImageSelected = selectedImages.length > 0;

    return (
        <div
            className="px-1 bg-neutral-200 bg-opacity-80 backdrop-blur-2xl fixed bottom-0 w-full z-50 flex flex-col pt-0.5 nav-bar-section border-t border-gray-400">
            <div className="grid grid-cols-4 gap-6">
                <div className={"col-start-1 col-span-3 place-self-center text-slate-700 text-xl font-bold"}>
                    {selectedImages.length === 1 ? `${selectedImages.length} Image Selected` : `${selectedImages.length} Images Selected`}
                </div>
                <button type="button" disabled={!onImageSelected}
                    className={`m-auto col-start-4 fill-inherit rounded-[36px] place-self-center backdrop-blur-[5rem]bg-slate-400 bg-opacity-40 px-2.5 py-1 ${onImageSelected ? "active-action-link" : "action-bar-button"}`}
                    onClick={onAdd}>
                    <div className={"justify-center items-center content-center gap-1"}><Plus
                        width={40} height={40} /> Add
                    </div>
                </button>
            </div>
        </div>
    );

}

export default LibInAlbumActionBar;