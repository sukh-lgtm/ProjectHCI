import React from "react";
import {Camera, Check, MapPin, Tag, X} from "lucide-react";

function SaleInfo({
  show,
  onClose,
  title,
  tags,
  price,
  preview,
  author,
  date,
  location,
}) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto min-h-screen">
      <div className="flex items-end justify-center pt-28 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-gray-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
          <div className="bg-gray-100 pb-4 p-4">
            <div className="flex ">
              <div className="text-center sm:mt-0 sm:ml-4 sm:text-left w-full flex flex-col">
                <button
                  type="button"
                  onClick={onClose}
                  className="backdrop-blur-[5rem] outline outline-slate-700  bg-opacity-40 px-2.5 py-1 rounded-3xl self-start"
                >
                  <div
                    className={
                      "flex flex-row justify-center items-center content-center gap-1"
                    }
                  >
                    <X width={15} height={15} /> Close{" "}
                  </div>
                </button>
                <h3
                  className="uppercase text-lg leading-6  text-gray-900 font-bold"
                  id="modal-headline"
                >
                  {title}
                </h3>
                <div className="self-start text-left mt-2">
                  <img src={preview} alt=""/>
                  <div className={"mt-2"}>
                    <div className={"text-sm text-gray-600 flex flex-row items-center gap-1"}>
                      <Camera width={18} height={18} className={"font-medium"}/> Picture by <div
                        className={"font-bold text-blue-500"}>{author}</div> taken on <div
                        className={"font-bold"}>{date}</div>
                    </div>
                  </div>

                  <div className={"mt-2"}>
                    <div className={"text-sm font-medium text-gray-600 flex flex-row items-center gap-1"}>
                      <MapPin width={18} height={18}/> {location}
                    </div>
                  </div>

                  <div className={"mt-2"}>
                    <div className={"text-sm font-medium text-gray-600 flex flex-row items-center gap-1"}>
                      <Tag width={18} height={18}/> {tags && tags.length > 0 ?
                        tags.map((tag, index) => (
                            <div
                                className={"px-2 py-1 bg-slate-300 rounded-lg"}> {tag} </div>
                        ))
                        : <>-</>}
                    </div>
                  </div>
                </div>
                <button
                    onClick={onClose}
                    className="backdrop-blur-[5rem]bg-opacity-40 mt-4 px-5 py-1 rounded-3xl outline outline-slate-700 bg-green-400 self-end"
                >
                  {price} PURCHASE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleInfo;
