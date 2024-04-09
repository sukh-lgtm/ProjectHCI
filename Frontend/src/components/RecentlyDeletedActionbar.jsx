import { Trash2, ArchiveRestore } from "lucide-react";

function RecentlyDeletedActionbar({onDelete, onRestore, selectedImages}) {
    const onImageSelected = selectedImages.length > 0;

    return (
        <div
            className="px-1 bg-neutral-200 bg-opacity-80 backdrop-blur-2xl fixed bottom-0 w-full z-50 flex flex-col pt-0.5 nav-bar-section border-t border-gray-400">
            <div className="flex flex-cols-2 gap-6">
                <button type="button" disabled={!onImageSelected}
                    className={`m-auto col-start-1 fill-inherit rounded-[36px] place-self-center backdrop-blur-[5rem]bg-slate-400 bg-opacity-40 px-2.5 py-1 ${onImageSelected ? "active-action-link" : "action-bar-button"}`}
                    onClick={onRestore}>
                    {
                        <div className={"flex flex-col justify-center items-center content-center gap-1"}><ArchiveRestore
                            width={40} height={40} /> Restore
                        </div>
                    }
                </button>
                <button type="button" disabled={!onImageSelected}
                    className={`m-auto col-start-2 fill-inherit rounded-[36px] place-self-center backdrop-blur-[5rem]bg-slate-400 bg-opacity-40 px-2.5 py-1 ${onImageSelected ? "active-action-link" : "action-bar-button"}`}
                    onClick={onDelete}>
                    {
                        <div className={"flex flex-col justify-center items-center content-center gap-1"}><Trash2
                            width={40} height={40} /> Delete
                        </div>
                    }
                </button>
            </div>
        </div>
    );
}

export default RecentlyDeletedActionbar;
